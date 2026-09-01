import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, subject, message, token } = body;

    if (!name || !phone || !email || !subject || !message || !token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!RECAPTCHA_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: reCAPTCHA is not configured.' },
        { status: 503 }
      );
    }

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.success || verifyData.score < 0.5) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Bot suspected.' },
        { status: 400 }
      );
    }

    const emailPromise = resend.emails.send({
      from: 'noreply@vivexatech.in',
      to: 'contact@vivexatech.in',
      subject: `New Contact Form - ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2563eb;">New Contact Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      `,
    });

    try {
      await addDoc(collection(db, 'contact_messages'), {
        fullName: name,
        email,
        phone,
        subject,
        message,
        source: 'Website Contact Form',
        status: 'Unread',
        createdAt: serverTimestamp(),
      });
    } catch (dbError) {
      console.error('Contact Form Firebase save failed:', dbError);
      return NextResponse.json(
        { error: 'Failed to save your message. Please try again or email us directly.' },
        { status: 500 }
      );
    }

    try {
      await emailPromise;
    } catch (emailError) {
      console.error('Contact Form Email sending failed:', emailError);
    }

    return NextResponse.json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Contact Form/reCAPTCHA Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

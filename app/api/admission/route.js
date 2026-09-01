import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

function mapQualification(q) {
  const map = {
    '10th': '10th',
    '12th': '12th',
    graduate: 'Graduate',
    'post-graduate': 'Post Graduate',
    undergraduate: 'Undergraduate',
    diploma: 'Diploma',
  };
  return map[String(q || '').toLowerCase()] || q || '';
}

function mapGender(g) {
  if (!g) return '';
  const s = String(g).toLowerCase();
  if (s === 'male') return 'Male';
  if (s === 'female') return 'Female';
  if (s === 'other') return 'Other';
  return g;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName, fatherName, email, phone,
      dob, gender, course, qualification,
      address, message, token,
    } = body;

    if (!fullName?.trim() || !phone?.trim() || !course?.trim() || !token) {
      return NextResponse.json({ error: 'Full name, phone, course, and verification are required.' }, { status: 400 });
    }

    if (!RECAPTCHA_SECRET_KEY) {
      return NextResponse.json({ error: 'Server configuration error: reCAPTCHA is not configured.' }, { status: 503 });
    }

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.success || verifyData.score < 0.5) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 });
    }

    const year = new Date().getFullYear();
    const inquiryId = `INQ-${year}-W${String(Date.now()).slice(-7)}`;
    const phoneNormalized = String(phone).replace(/\D/g, '').slice(-10);

    const descriptionParts = [
      fatherName ? `Father: ${fatherName}` : '',
      dob ? `DOB: ${dob}` : '',
      address ? `Address: ${address}` : '',
      message || '',
    ].filter(Boolean);

    try {
      await addDoc(collection(db, 'institute_inquiries'), {
        inquiryId,
        fullName: fullName.trim(),
        age: null,
        gender: mapGender(gender),
        phone: phone.trim(),
        phoneNormalized,
        email: (email || '').trim(),
        educationStatus: mapQualification(qualification),
        occupation: '',
        courseId: '',
        courseTitle: course.trim(),
        source: 'Online',
        studentPhotoUrl: '',
        aadhaarUrl: '',
        description: descriptionParts.join('\n'),
        internalNotes: '',
        status: 'New',
        priority: 'Medium',
        nextFollowUpDate: null,
        lastContactDate: null,
        followUpCount: 0,
        nextAction: '',
        followUpHistory: [],
        createdBy: 'website',
        createdByName: 'Website Admission Form',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        admissionId: null,
        convertedAt: null,
      });
    } catch (dbError) {
      console.error('Admission inquiry Firestore save failed:', dbError);
      return NextResponse.json(
        { error: 'Failed to save your enquiry. Please try again or call us directly.' },
        { status: 500 }
      );
    }

    const instituteEmail = process.env.INSTITUTE_EMAIL || 'contact@vivexatech.in';

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'noreply@vivexatech.in',
          to: instituteEmail,
          subject: `New Admission Enquiry: ${fullName} — ${course} (${inquiryId})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1e293b;">
              <div style="background-color: #6C3CE9; padding: 20px; border-radius: 8px 8px 0 0; color: white;">
                <h2 style="margin: 0;">New Online Admission Request</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">${inquiryId} · Course: ${course}</p>
              </div>
              <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                <p>This enquiry was saved to <strong>Inquiry Management</strong> in the admin panel.</p>
                <h3>Personal Details</h3>
                <p><strong>Student Name:</strong> ${fullName}</p>
                <p><strong>Father's Name:</strong> ${fatherName || '—'}</p>
                <p><strong>Date of Birth:</strong> ${dob || '—'}</p>
                <p><strong>Gender:</strong> ${gender || '—'}</p>
                <h3>Contact</h3>
                <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
                <p><strong>Email:</strong> ${email || 'Not provided'}</p>
                <p><strong>Address:</strong> ${address || '—'}</p>
                <h3>Academic</h3>
                <p><strong>Course:</strong> ${course}</p>
                <p><strong>Qualification:</strong> ${qualification || '—'}</p>
                ${message ? `<h3>Message</h3><p>${message}</p>` : ''}
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Admission enquiry email failed:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      message: 'Your admission enquiry was submitted successfully. Our team will contact you soon.',
    });
  } catch (error) {
    console.error('Admission Form Error:', error);
    return NextResponse.json({ error: 'Failed to send your enquiry. Please try again or call us directly.' }, { status: 500 });
  }
}

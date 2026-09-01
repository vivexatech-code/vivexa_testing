export interface CourseEnrollment {
  courseId: string; title: string; instructor: string; batchId?: string; batch?: string;
  progress: number; totalClasses: number; completedClasses: number; attendancePercentage: number;
  isLiveNow: boolean; liveTopic: string; enrolledAt?: string;
}
export interface StudentProfile {
  uid: string; studentId: string; fullName: string; email: string; phone: string; course: string;
  courseId?: string; batch?: string; rollNumber?: string; parentName?: string; status: string;
  address?: string; qualification?: string; joinDate?: string; role: string; mustChangePassword: boolean;
  avatarUrl?: string; enrolledCourses: CourseEnrollment[]; enrolledCourse: CourseEnrollment | null;
  preferences: UserPreferences;
}
export interface UserPreferences { inAppNotifications: boolean; emailAlerts: boolean }
export interface ClassSchedule {
  id: string; courseId?: string; title: string; topic: string; date: string; time: string; duration: string;
  startTime?: string; endTime?: string; status: "upcoming" | "live" | "completed"; meetLink?: string;
  instructor: string; batch?: string;
}
export interface TestQuestion { id: string; question: string; options: string[] }
export interface TestAssignment {
  id: string; instituteTestId?: string; courseId?: string; title: string; description?: string;
  type: "weekly" | "monthly"; dueDate: string; questions: number; questionItems?: TestQuestion[];
  duration: number; timeLimitInSeconds?: number; status: "pending" | "completed" | "disabled";
  score?: number; maxScore?: number; passingMarks?: number; enabled: boolean; isAssigned?: boolean; canAttempt?: boolean;
}
export interface TestHistory { id: string; courseId?: string; title: string; date: string; score: number; maxScore: number; type: "weekly" | "monthly" }
export interface AttendanceRecord { present: number[]; absent: number[]; upcoming: number[]; percentage: number }
export interface Recording { id: string; courseId?: string; title: string; description?: string; date: string; duration: string; topic?: string; secureVideoUrl?: string; thumbnailUrl?: string; fileSize?: number }
export interface StudyMaterial { id: string; courseId: string; title: string; type: string; fileUrl: string; createdAt?: string }
export interface Achievement { id: string; title: string; description: string; icon: string; earned: boolean; earnedDate?: string }
export interface PerformanceMetrics { overallScore: number; attendanceScore: number; testScore: number; progressScore: number; grade: string; rank?: string }
export interface AppNotification { id: string; type: string; title: string; message: string; time: string; isRead: boolean; route?: string; createdAt?: string }
export interface CalendarEvent { id: string; title: string; date: string; time: string; type: "class" | "test" | "holiday"; color: string }
export interface Certificate { id: string; courseId?: string; courseName: string; issueDate: string; issueMonth?: string; issueYear?: string; organizationName: string; certificateUrl: string; thumbnailUrl?: string }
export interface FeeTransaction { id: string; date: string; amount: number; status: string; method: string; transactionId?: string }
export interface FeeInstallment { amount: number; method?: string; transactionId?: string; date: string; note?: string }
export interface FeeSummary {
  totalFee: number; paidAmount: number; dueAmount: number; remainingBalance: number; dueDate: string;
  nextDueDate: string; paymentStatus: "Paid" | "Partial" | "Pending" | "Overdue"; installmentType?: string;
  course?: string; paymentUrl?: string; transactions: FeeTransaction[]; installments: FeeInstallment[];
}
export interface BatchSchedule { id: string; batchId: string; name: string; courseId: string; trainerName: string; meetLink?: string; schedule?: { days: string[]; startTime: string; endTime: string } }
export interface Course { id: string; courseId?: string; title: string; description: string; imageUrl?: string; category?: string; duration?: string; instructorName?: string; status?: "active" | "inactive" }
export interface Category { id: string; name: string; icon?: string }

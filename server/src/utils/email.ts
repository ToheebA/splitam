import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

const sendVerificationEmail = async (email: string, token: string) => {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`

    const response = await resend.emails.send({
        from: 'SplitAm <onboarding@resend.dev>',
        to: process.env.NODE_ENV as string === 'production'
            ? email
            : 'olufade.toheeb@gmail.com',
        subject: 'verify your SplitAm account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #16a34a;">Welcome to SplitAm!</h1>
                <p>Thanks for signing up! Please verify your email address to get started.</p>
                <a href="${verificationUrl}" 
                style="background: #16a34a; color: white; padding: 12px 24px; 
                        border-radius: 8px; text-decoration: none; display: inline-block; margin: 20px 0;">
                    Verify Email
                </a>
                <p style="color: #6b7280;">This link expires in 24 hours.</p>
                <p style="color: #6b7280;">If you didn't create an account, ignore this email.</p>
            </div>
        `
    })

    if (response.error) {
        console.log('Email error:', response.error)
        throw new Error('Failed to send verification email')
    }
}

const sendGroupPurchasedEmail = async (email: string, groupName: string) => {
    const response = await resend.emails.send({
        from: 'SplitAm <onboarding@resend.dev>',
        to: process.env.NODE_ENV as string === 'production'
            ? email
            : 'olufade.toheeb@gmail.com',
        subject: 'Group Purchased',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #16a34a;">Group Purchased!</h1>
                <p>Congratulations! Your group for "<strong>${groupName}</strong>" bulk purchase is complete.</p>
                <p>Thank you for using SplitAm!</p>
            </div>
        `
    })

    if (response.error) {
        console.log('Email error:', response.error)
        throw new Error('Failed to send group purchased email')
    }
}

export { 
    sendVerificationEmail,
    sendGroupPurchasedEmail
}
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import ContactFormEmail from '@/emails/contact-form-email';

export const runtime = 'edge';

// Rate limiter: 3 messages per 60 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "60 s"),
    analytics: true,
});

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    website_url: z.string().optional(),
});

export async function POST(req: Request) {
    // Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing');
        return NextResponse.json(
            { error: 'Mail transport system configuration error' },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();

        // Silent Discard: If honeypot is populated, return 200 OK but don't send
        if (body.website_url && body.website_url.length > 0) {
            console.warn('Spam detected: website_url populated. Silently discarding.');
            return NextResponse.json({ success: true, message: 'Signal accepted' });
        }

        const validatedData = contactSchema.parse(body);

        const { data, error } = await resend.emails.send({
            from: 'Kache Digital <hq@kache.digital>',
            to: ['kachecoder@gmail.com'],
            subject: `[Lead] New Inquiry from ${validatedData.name}`,
            react: ContactFormEmail({
                name: validatedData.name,
                email: validatedData.email,
                message: validatedData.message,
            }),
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send message' }, { status: 400 });
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.issues },
                { status: 400 }
            );
        }
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Native Digital Media'

interface ContactConfirmationProps {
  name?: string
  message?: string
}

const ContactConfirmationEmail = ({ name, message }: ContactConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for contacting {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Thanks, ${name}!` : 'Thanks for reaching out!'}
        </Heading>
        <Text style={text}>
          We've received your message and a member of our team will get back to you within 24 hours.
        </Text>
        {message ? (
          <>
            <Text style={label}>Your message:</Text>
            <Text style={quote}>{message}</Text>
          </>
        ) : null}
        <Text style={text}>
          In the meantime, feel free to reply to this email if you have anything to add.
        </Text>
        <Text style={footer}>— The {SITE_NAME} Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: 'We received your message',
  displayName: 'Contact form confirmation',
  previewData: {
    name: 'Jane',
    message: 'Hi, I would like a quote for a new website.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const label = { fontSize: '13px', color: '#0f172a', fontWeight: 600, margin: '16px 0 6px' }
const quote = {
  fontSize: '14px',
  color: '#334155',
  lineHeight: '1.5',
  whiteSpace: 'pre-wrap' as const,
  backgroundColor: '#f8fafc',
  borderLeft: '3px solid #2563eb',
  padding: '12px 16px',
  margin: '0 0 16px',
}
const footer = { fontSize: '13px', color: '#64748b', margin: '24px 0 0' }

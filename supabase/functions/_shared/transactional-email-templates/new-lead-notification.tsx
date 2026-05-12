import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Native Digital Media'

interface NewLeadProps {
  name?: string
  email?: string
  phone?: string
  website?: string
  businessType?: string
  message?: string
  source?: string
  auditScore?: number | string
  auditSummary?: string
  auditRecommendations?: string[]
  auditError?: string
}

const Row = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <Text style={row}>
      <strong style={rowLabel}>{label}:</strong> {value}
    </Text>
  ) : null

const NewLeadEmail = ({
  name,
  email,
  phone,
  website,
  businessType,
  message,
  source,
  auditScore,
  auditSummary,
  auditRecommendations,
  auditError,
}: NewLeadProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New lead{name ? ` from ${name}` : ''}{website ? ` — ${website}` : ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Lead from {SITE_NAME}</Heading>
        <Section style={card}>
          <Row label="Name" value={name} />
          <Row label="Email" value={email} />
          <Row label="Phone" value={phone} />
          <Row label="Website" value={website} />
          <Row label="Business type" value={businessType} />
          <Row label="Source" value={source} />
          {message ? (
            <>
              <Hr style={hr} />
              <Text style={rowLabel}>Message</Text>
              <Text style={messageStyle}>{message}</Text>
            </>
          ) : null}
        </Section>

        {auditSummary ? (
          <Section style={auditCard}>
            <Heading as="h2" style={h2}>
              AI Audit{auditScore !== undefined ? ` — Score: ${auditScore}` : ''}
            </Heading>
            <Text style={text}>{auditSummary}</Text>
            {auditRecommendations && auditRecommendations.length > 0 ? (
              <ul style={list}>
                {auditRecommendations.map((r, i) => (
                  <li key={i} style={listItem}>{r}</li>
                ))}
              </ul>
            ) : null}
          </Section>
        ) : auditError ? (
          <Text style={muted}><em>AI audit unavailable: {auditError}</em></Text>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>You received this because a visitor submitted a form on {SITE_NAME}.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewLeadEmail,
  subject: (d: NewLeadProps) =>
    `New Lead: ${d.name ?? 'Visitor'}${d.website ? ` — ${d.website}` : ''}`,
  displayName: 'New lead notification',
  to: 'sales@nativedigital.co.za',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+27 73 000 0000',
    website: 'https://example.co.za',
    businessType: 'Retail',
    message: 'Looking for a website refresh and SEO.',
    source: 'homepage',
    auditScore: 72,
    auditSummary: 'Solid foundation, but page speed and meta tags need work.',
    auditRecommendations: ['Compress hero images', 'Add meta descriptions', 'Fix mobile CLS'],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const h2 = { fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 8px' }
const card = { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px 20px', margin: '0 0 16px' }
const auditCard = { backgroundColor: '#eff6ff', borderRadius: '8px', padding: '16px 20px', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 12px' }
const messageStyle = { fontSize: '14px', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' as const, margin: '0' }
const row = { fontSize: '14px', color: '#334155', margin: '0 0 6px' }
const rowLabel = { color: '#0f172a', fontWeight: 600 } as const
const list = { paddingLeft: '20px', margin: '8px 0 0' }
const listItem = { fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 4px' }
const muted = { fontSize: '13px', color: '#64748b', fontStyle: 'italic' as const }
const hr = { borderColor: '#e2e8f0', margin: '16px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '0' }

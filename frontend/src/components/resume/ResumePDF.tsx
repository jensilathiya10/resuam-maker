'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { ResumeData, TemplateType } from '@/types';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter_28pt-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Inter_28pt-SemiBold.ttf', fontWeight: 500 },
    { src: '/fonts/Inter_28pt-Bold.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#111827',
  },
  header: {
    padding: 32,
    backgroundColor: '#8B5CF6', // violet-600
    borderRadius: 4,
    color: '#fff',
  },
  headerName: { fontSize: 28, fontWeight: 700, marginBottom: 8 },
  headerContact: { fontSize: 10, flexDirection: 'row', gap: 8, opacity: 0.9 },
  section: { padding: 32 },
  sectionTitle: { fontSize: 14, fontWeight: 600, marginBottom: 8 },
  skillBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#EDE9FE', // violet-100
    color: '#7C3AED', // violet-700
    borderRadius: 12,
    fontSize: 9,
    marginRight: 4,
    marginBottom: 4,
  },
  experienceItem: { marginBottom: 8 },
  experienceTitle: { fontSize: 11, fontWeight: 600 },
  experienceCompany: { fontSize: 10, color: '#4B5563' },
  listItem: { marginLeft: 8, fontSize: 10, color: '#4B5563' },
  educationItem: { marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  educationText: { fontSize: 10, color: '#4B5563' },
});

const pageStyle = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333',
  },
});

interface ModernTemplateProps {
  resumeData: ResumeData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData;
  console.log(resumeData);
  return (
    <View style={pageStyle.page}>
      {/* Header */}
      <View style={{ borderBottomWidth: 2, borderBottomColor: '#4F46E5', paddingBottom: 12, marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>
          {personalInfo.fullName || 'Your Name'}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 8 }}>
          {personalInfo.email && <Text style={{ fontSize: 10, color: '#4B5563' }}>{personalInfo.email}</Text>}
          {personalInfo.phone && <Text style={{ fontSize: 10, color: '#4B5563' }}>• {personalInfo.phone}</Text>}
          {personalInfo.location && <Text style={{ fontSize: 10, color: '#4B5563' }}>• {personalInfo.location}</Text>}
        </View>
        {(personalInfo.linkedin || personalInfo.portfolio) && (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            {personalInfo.linkedin && <Text style={{ fontSize: 10, color: '#4F46E5' }}>{personalInfo.linkedin}</Text>}
            {personalInfo.portfolio && <Text style={{ fontSize: 10, color: '#4F46E5' }}>• {personalInfo.portfolio}</Text>}
          </View>
        )}
      </View>

      {/* Summary */}
      {summary && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>Professional Summary</Text>
          <Text style={{ fontSize: 10, color: '#374151' }}>{summary}</Text>
        </View>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Work Experience</Text>
          {experience.map((exp, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{exp.jobTitle}</Text>
                  <Text style={{ fontSize: 10, color: '#4B5563' }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</Text>
                </View>
                <Text style={{ fontSize: 10, color: '#6B7280' }}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
              </View>
              {exp.description && exp.description.length > 0 && (
                <View style={{ marginTop: 4 }}>
                  {exp.description.filter(Boolean).map((desc, i) => (
                    <Text key={i} style={{ fontSize: 10, color: '#374151', marginLeft: 8 }}>• {desc}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Education</Text>
          {education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{edu.degree}</Text>
                  <Text style={{ fontSize: 10, color: '#4B5563' }}>{edu.institution}</Text>
                </View>
                <Text style={{ fontSize: 10, color: '#6B7280' }}>{edu.startDate} - {edu.endDate}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {skills?.technical?.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            Skills
          </Text>

          {/* If more than 4 → 2 columns */}
          {skills.technical.length > 4 ? (
            <View style={{ flexDirection: 'row' }}>
              {/* Left Column */}
              <View style={{ width: '50%', paddingRight: 10 }}>
                {skills.technical
                  .slice(0, Math.ceil(skills.technical.length / 2))
                  .map((skill, i) => (
                    <Text key={i} style={{ fontSize: 10, marginBottom: 4 }}>
                      • {skill}
                    </Text>
                  ))}
              </View>

              {/* Right Column */}
              <View style={{ width: '50%' }}>
                {skills.technical
                  .slice(Math.ceil(skills.technical.length / 2))
                  .map((skill, i) => (
                    <Text key={i} style={{ fontSize: 10, marginBottom: 4 }}>
                      • {skill}
                    </Text>
                  ))}
              </View>
            </View>
          ) : (
            <View>
              {skills.technical.map((skill, i) => (
                <Text key={i} style={{ fontSize: 10, marginBottom: 4 }}>
                  • {skill}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {skills?.soft?.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            Soft Skills
          </Text>

          {/* If more than 4 → 2 columns */}
          {skills.soft.length > 4 ? (
            <View style={{ flexDirection: 'row' }}>
              {/* Left Column */}
              <View style={{ width: '50%', paddingRight: 10 }}>
                {skills.soft
                  .slice(0, Math.ceil(skills.soft.length / 2))
                  .map((skill, i) => (
                    <Text key={i} style={{ fontSize: 10, marginBottom: 4 }}>
                      • {skill}
                    </Text>
                  ))}
              </View>

              {/* Right Column */}
              <View style={{ width: '50%' }}>
                {skills.soft
                  .slice(Math.ceil(skills.soft.length / 2))
                  .map((skill, i) => (
                    <Text key={i} style={{ fontSize: 10, marginBottom: 4 }}>
                      • {skill}
                    </Text>
                  ))}
              </View>
            </View>
          ) : (
            <View>
              {skills.soft.map((skill, i) => (
                <Text key={i} style={{ fontSize: 10, marginBottom: 4 }}>
                  • {skill}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Projects</Text>
          {projects.map((project, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{project.name}</Text>
              {project.description && <Text style={{ fontSize: 10, color: '#4B5563' }}>{project.description}</Text>}
              {project.technologies?.length > 0 && (
                <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>Technologies: {project.technologies.join(', ')}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <View>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Certifications</Text>
          {certifications.map((cert, index) => (
            <View key={index} style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 10 }}>
                <Text style={{ fontWeight: 600 }}>{cert.name}</Text>
                <Text style={{ color: '#4B5563' }}> - {cert.issuer}</Text>
                <Text style={{ color: '#6B7280' }}> ({cert.date})</Text>
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

interface MinimalTemplateProps {
  resumeData: ResumeData;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, skills, education, projects, certifications } = resumeData;

  return (
    <View style={pageStyle.page}>
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 300, color: '#111827', marginBottom: 4 }}>
          {personalInfo.fullName || 'Your Name'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {personalInfo.email && <Text style={{ fontSize: 10, color: '#6B7280' }}>{personalInfo.email}</Text>}
          {personalInfo.phone && <Text style={{ fontSize: 10, color: '#6B7280' }}>{personalInfo.phone}</Text>}
          {personalInfo.location && <Text style={{ fontSize: 10, color: '#6B7280' }}>{personalInfo.location}</Text>}
          {personalInfo.linkedin && <Text style={{ fontSize: 10, color: '#6B7280' }}>LinkedIn: {personalInfo.linkedin}</Text>}
          {personalInfo.portfolio && <Text style={{ fontSize: 10, color: '#6B7280' }}>Portfolio: {personalInfo.portfolio}</Text>}
        </View>
      </View>

      {/* Summary */}
      {summary && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 9, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Summary</Text>
          <Text style={{ fontSize: 10, color: '#4B5563', lineHeight: 1.6 }}>{summary}</Text>
        </View>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 9, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Experience</Text>
          {experience.map((exp, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, fontWeight: 500, color: '#111827' }}>{exp.jobTitle}</Text>
                <Text style={{ fontSize: 10, color: '#6B7280' }}>{exp.startDate} — {exp.endDate || 'Present'}</Text>
              </View>
              <Text style={{ fontSize: 10, color: '#4B5563' }}>{exp.company} {exp.location && `• ${exp.location}`}</Text>
              {exp.description?.length > 0 && (
                <View style={{ marginTop: 4 }}>
                  {exp.description.map((point, i) => (
                    <Text key={i} style={{ fontSize: 10, color: '#4B5563' }}>• {point}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 9, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Education</Text>
          {education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, fontWeight: 500, color: '#111827' }}>{edu.degree}</Text>
                <Text style={{ fontSize: 10, color: '#6B7280' }}>{edu.startDate} — {edu.endDate}</Text>
              </View>
              <Text style={{ fontSize: 10, color: '#4B5563' }}>{edu.institution} {edu.location && `• ${edu.location}`}</Text>
              {edu.gpa && <Text style={{ fontSize: 10, color: '#4B5563' }}>GPA: {edu.gpa}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Technical Skills */}
      {skills?.technical?.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 9, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Technical Skills</Text>
          <Text style={{ fontSize: 10, color: '#4B5563' }}>{skills.technical.join(' · ')}</Text>
        </View>
      )}

      {/* Soft Skills */}
      {skills?.soft?.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 9, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Soft Skills</Text>
          <Text style={{ fontSize: 10, color: '#4B5563' }}>{skills.soft.join(' · ')}</Text>
        </View>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 9, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Projects</Text>
          {projects.map((project, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: 500, color: '#111827' }}>{project.name}</Text>
              <Text style={{ fontSize: 10, color: '#4B5563' }}>{project.description}</Text>
              <Text style={{ fontSize: 10, color: '#4B5563'}}>Tech: {project.technologies.join(', ')}</Text>
              {project.link && <Text style={{ fontSize: 10, color: '#4B5563'}}>Link: {project.link}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <View>
          <Text style={{ fontSize: 9, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Certifications</Text>
          {certifications.map((cert, index) => (
            <Text key={index} style={{ fontSize: 10, color: '#4B5563' }}>
              {cert.name} — {cert.issuer} ({cert.date})
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

interface CreativeTemplateProps {
  resumeData: ResumeData;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, skills, experience } = resumeData;
  console.log(resumeData)

  return (
    <view>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerName}>{resumeData.personalInfo?.fullName || 'Your Name'}</Text>
        <View style={styles.headerContact}>
          {resumeData.personalInfo?.email && <Text style={styles.headerContact}>{resumeData.personalInfo.email}</Text>}
          {resumeData.personalInfo?.phone && <Text style={styles.headerContact}>• {resumeData.personalInfo.phone}</Text>}
          {resumeData.personalInfo?.location && <Text style={styles.headerContact}>• {resumeData.personalInfo.location}</Text>}
        </View>
      </View>

      {/* Main content */}
      <View style={styles.section}>
        {/* Summary */}
        {resumeData.summary && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ fontSize: 10, color: '#4B5563' }}>{resumeData.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {(resumeData.skills?.technical || []).length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {resumeData.skills.technical.map((skill, i) => (
                <Text key={i} style={styles.skillBadge}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {(resumeData.skills?.soft || []).length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Soft Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {resumeData.skills.soft.map((skill, i) => (
                <Text key={i} style={styles.skillBadge}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {(resumeData.experience || []).length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resumeData.experience.map((exp, i) => (
              <View key={i} style={styles.experienceItem}>
                <Text style={styles.experienceTitle}>{exp.jobTitle}</Text>
                <Text style={styles.experienceCompany}>{exp.company} | {exp.startDate} - {exp.endDate || 'Present'}</Text>
                {exp.description?.map((desc, j) => (
                  <Text key={j} style={styles.listItem}>• {desc}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {(resumeData.education || []).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {resumeData.education.map((edu, i) => (
              <View key={i} style={styles.educationItem}>
                <View>
                  <Text style={{ fontWeight: '600' }}>{edu.degree}</Text>
                  <Text style={styles.educationText}>{edu.institution}</Text>
                </View>
                <Text style={{ fontSize: 10, color: '#6B7280' }}>{edu.startDate} - {edu.endDate}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </view>
  );
};

interface ResumePDFProps {
  resumeData: ResumeData;
  template: TemplateType;
}

export const ResumePDF: React.FC<ResumePDFProps> = ({ resumeData, template }) => {
  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {template === 'modern' && <ModernTemplate resumeData={resumeData} />}
        {template === 'minimal' && <MinimalTemplate resumeData={resumeData} />}
        {template === 'creative' && <CreativeTemplate resumeData={resumeData} />}
      </Page>
    </Document>
  );
};

export default ResumePDF;

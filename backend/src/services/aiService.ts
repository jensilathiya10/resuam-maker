import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey ? new OpenAI({ apiKey }) : null;

const isOpenAIAvailable = () => {
  if (!openai) {
    console.warn('OpenAI API key not configured. AI features will return placeholder content.');
    return false;
  }
  return true;
};

export const generateSummary = async (
  jobRole: string,
  experienceLevel: string,
  skills: string[],
  workHistoryNotes: string
): Promise<string> => {
  const prompt = `
You are a professional resume writer. Generate a compelling professional summary for a resume.

Job Role: ${jobRole}
Experience Level: ${experienceLevel}
Skills: ${skills.join(', ')}
Work History Notes: ${workHistoryNotes}

Requirements:
- Keep it to 3-4 sentences
- Highlight years of experience and key skills
- Make it ATS-friendly with relevant keywords
- Professional tone
- No personal pronouns

Generate the summary now:
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer with expertise in creating ATS-optimized content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate summary');
  }
};

export const generateExperienceBullets = async (
  jobTitle: string,
  company: string,
  experienceDetails: string
): Promise<string[]> => {
  const prompt = `
You are a professional resume writer. Generate 5-7 impactful bullet points for work experience.

Job Title: ${jobTitle}
Company: ${company}
Experience Details: ${experienceDetails}

Requirements:
- Start with action verbs
- Use quantifiable metrics where possible (%, $, numbers)
- Keep each bullet point concise (1-2 lines)
- Focus on achievements, not just duties
- Make them ATS-friendly
- Format as a JSON array of strings

Generate the bullet points now:
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Return ONLY a valid JSON array of strings, nothing else.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    const bullets = JSON.parse(content);
    return Array.isArray(bullets) ? bullets : [];
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate experience bullets');
  }
};

// Generate 3 different resume variants
export const generateResumeVariants = async (
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  },
  skills: { technical: string[]; soft: string[] },
  experience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>,
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
  }>,
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }>
): Promise<Array<{
  id: string;
  name: string;
  style: 'classic' | 'modern' | 'creative';
  summary: string;
  experience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
}>> => {
  // If OpenAI is not configured, return placeholder data
  if (!isOpenAIAvailable() || !openai) {
    const jobTitle = experience[0]?.jobTitle || 'Professional';
    const skillList = skills.technical.slice(0, 5).join(', ');
    
    return [
      {
        id: 'classic',
        name: 'Classic Professional',
        style: 'classic',
        summary: `Dedicated ${jobTitle} with extensive experience in ${skillList}. Proven track record of delivering results and leading teams to success. Seeking to leverage expertise in a challenging new role.`,
        experience: experience.length > 0 ? experience : [{
          jobTitle: jobTitle,
          company: 'Company Name',
          location: personalInfo.location,
          startDate: '2020',
          endDate: 'Present',
          description: [
            'Led key initiatives resulting in significant business growth',
            'Managed cross-functional teams to deliver projects on time',
            'Implemented innovative solutions that improved efficiency'
          ]
        }]
      },
      {
        id: 'modern',
        name: 'Modern Minimalist',
        style: 'modern',
        summary: `${jobTitle} professional specializing in ${skillList}. Focus on delivering high-impact results through strategic thinking and technical excellence.`,
        experience: experience.length > 0 ? experience : [{
          jobTitle: jobTitle,
          company: 'Company Name',
          location: personalInfo.location,
          startDate: '2020',
          endDate: 'Present',
          description: [
            'Drove 30% increase in team productivity',
            'Spearheaded digital transformation initiatives',
            'Built scalable solutions used by thousands'
          ]
        }]
      },
      {
        id: 'creative',
        name: 'Creative Impact',
        style: 'creative',
        summary: `Innovative ${jobTitle} who brings creativity and technical prowess to every project. Passionate about building products that make a difference.`,
        experience: experience.length > 0 ? experience : [{
          jobTitle: jobTitle,
          company: 'Company Name',
          location: personalInfo.location,
          startDate: '2020',
          endDate: 'Present',
          description: [
            'Transformed user experience with cutting-edge solutions',
            'Award-winning projects that exceeded expectations',
            'Pioneered new approaches adopted industry-wide'
          ]
        }]
      }
    ];
  }

  const skillsList = [...skills.technical, ...skills.soft].join(', ');
  const experienceText = experience.map(e => 
    `${e.jobTitle} at ${e.company}: ${(e.description || []).join(' ')}`
  ).join('\n');
  const educationText = education.map(e => 
    `${e.degree} from ${e.institution}`
  ).join('\n');
  const projectsText = projects.map(p => 
    `${p.name}: ${p.description} (${(p.technologies || []).join(', ')})`
  ).join('\n');

  const prompt = `
You are a professional resume writer. Generate 3 DIFFERENT resume variants from the candidate's details.

CANDIDATE DETAILS:
Name: ${personalInfo.fullName}
Email: ${personalInfo.email}
Location: ${personalInfo.location}
Skills: ${skillsList}
Experience: ${experienceText || 'Not provided'}
Education: ${educationText || 'Not provided'}
Projects: ${projectsText || 'Not provided'}

Generate 3 distinct resume styles:

1. CLASSIC/FORMAL - Traditional, serif fonts, structured layout, formal language
2. MODERN/MINIMALIST - Clean, sans-serif, plenty whitespace, concise
3. CREATIVE/COLORFUL - Bold, dynamic, creative phrasing, highlights achievements

For each variant, provide:
- A unique professional summary (2-4 sentences) that matches the style
- Enhanced experience descriptions if provided, or create realistic ones based on the role

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "classic",
    "name": "Classic Professional",
    "style": "classic",
    "summary": "formal summary text...",
    "experience": [
      {
        "jobTitle": "Job Title",
        "company": "Company",
        "location": "Location",
        "startDate": "Jan 2020",
        "endDate": "Present",
        "description": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"]
      }
    ]
  },
  {
    "id": "modern",
    "name": "Modern Minimalist", 
    "style": "modern",
    "summary": "concise modern summary...",
    "experience": [...]
  },
  {
    "id": "creative",
    "name": "Creative Impact",
    "style": "creative", 
    "summary": "dynamic creative summary...",
    "experience": [...]
  }
]

Make each summary and experience description UNIQUE to that style. Return ONLY valid JSON.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Return ONLY a valid JSON array, nothing else.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    const parsed = JSON.parse(content);
    
    // Ensure we have 3 variants
    if (!Array.isArray(parsed) || parsed.length < 3) {
      throw new Error('Invalid response format');
    }
    
    return parsed;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return fallback data on error
    const jobTitle = experience[0]?.jobTitle || 'Professional';
    return [
      {
        id: 'classic',
        name: 'Classic Professional',
        style: 'classic' as const,
        summary: `Experienced ${jobTitle} professional with a track record of success.`,
        experience: experience.length > 0 ? experience : [{
          jobTitle,
          company: 'Company',
          location: personalInfo.location,
          startDate: '2020',
          endDate: 'Present',
          description: ['Led key initiatives', 'Managed teams', 'Delivered results']
        }]
      },
      {
        id: 'modern',
        name: 'Modern Minimalist',
        style: 'modern' as const,
        summary: `${jobTitle} focused on results and innovation.`,
        experience: experience.length > 0 ? experience : [{
          jobTitle,
          company: 'Company',
          location: personalInfo.location,
          startDate: '2020',
          endDate: 'Present',
          description: ['Drove growth', 'Built solutions', 'Led teams']
        }]
      },
      {
        id: 'creative',
        name: 'Creative Impact',
        style: 'creative' as const,
        summary: `Dynamic ${jobTitle} bringing creative solutions.`,
        experience: experience.length > 0 ? experience : [{
          jobTitle,
          company: 'Company',
          location: personalInfo.location,
          startDate: '2020',
          endDate: 'Present',
          description: ['Transformed outcomes', 'Innovated processes', 'Inspired teams']
        }]
      }
    ];
  }
};

export const generateFullResume = async (
  jobRole: string,
  experienceLevel: string,
  skills: string[],
  workHistoryNotes: string
): Promise<{
  summary: string;
  experience: Array<{
    jobTitle: string;
    company: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}> => {
  // If OpenAI is not configured, return mock data
  if (!isOpenAIAvailable() || !openai) {
    return {
      summary: `Experienced ${jobRole} with ${experienceLevel} of experience. Proficient in ${skills.slice(0, 5).join(', ')}. Passionate about delivering high-quality work and continuous improvement.`,
      experience: [
        {
          jobTitle: jobRole,
          company: 'Tech Company Inc.',
          bullets: [
            'Led development of key projects resulting in 30% efficiency improvement',
            'Collaborated with cross-functional teams to deliver products on time',
            'Implemented best practices that improved code quality by 25%',
            'Mentored junior developers and conducted code reviews',
            'Delivered technical solutions for complex business requirements'
          ]
        }
      ],
      projects: [
        {
          name: 'Key Project',
          description: 'Built and maintained critical features for product launch',
          technologies: skills.slice(0, 3)
        }
      ]
    };
  }

  const prompt = `
You are a professional resume writer. Generate a complete resume structure for a job seeker.

Job Role: ${jobRole}
Experience Level: ${experienceLevel}
Skills: ${skills.join(', ')}
Work History Notes: ${workHistoryNotes}

Generate a complete resume with the following structure (JSON format):
{
  "summary": "3-4 sentence professional summary",
  "experience": [
    {
      "jobTitle": "Job title",
      "company": "Company name",
      "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"]
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"]
    }
  ]
}

Make it ATS-friendly, professional, and highlight achievements. Return ONLY valid JSON.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Return ONLY a valid JSON object, nothing else.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return {
      summary: parsed.summary || '',
      experience: parsed.experience || [],
      projects: parsed.projects || [],
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate full resume');
  }
};

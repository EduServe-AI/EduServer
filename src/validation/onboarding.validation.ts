import { z } from 'zod'

export const userType = z.enum(['student', 'tutor'])

// Define the time slot schema
const timeSlotSchema = z.object({
    from: z.string(),
    to: z.string(),
})

// Define the day availability schema
const dayAvailabilitySchema = z.object({
    isEnabled: z.boolean(),
    slots: z.array(timeSlotSchema),
})

// Define the days of the week
const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
] as const

// Create availability schema
export const availabilitySchema = z.object({
    ...Object.fromEntries(
        daysOfWeek.map((day) => [day, dayAvailabilitySchema])
    ),
})

// Defining transcript schema
const transcriptSchema = z
    .object({
        name: z.string(),
        url: z.string(),
    })
    .nullable()

export const educationEntrySchema = z.object({
    universityName: z.string().min(3, 'University name is required.'),
    degree: z.string().min(2, 'Degree is required.'),
    degreeType: z.string().min(2, 'Degree type is required.'),
    cgpa: z.coerce.number().min(0).max(10),
    startYear: z.coerce.number(),
    endYear: z.coerce.number(),
    transcript: transcriptSchema,
})
export const skillsSchema = z.array(z.string())
export const languagesSchema = z.array(z.string())

export const onboardingSchema = z.object({
    education: z.array(educationEntrySchema).min(1),
    skills: skillsSchema,
    languages: languagesSchema,
    profileUrl: z.string().nullable(),
    bio: z.string().trim().min(50).max(500),
    githubUrl: z
        .string()
        .url('Please provide a valid GitHub URL.')
        .optional()
        .or(z.literal('')),
    linkedinUrl: z
        .string()
        .url('Please provide a valid LinkedIn URL.')
        .optional()
        .or(z.literal('')),
    availability: availabilitySchema,
})

// Type for the complete schema
export type OnboardingSchemaType = z.infer<typeof onboardingSchema>

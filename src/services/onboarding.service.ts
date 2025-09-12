import User from '../models/user.model'
import InstructorProfiles from '../models/instructorprofile.model'
import Education from '../models/education.model'
import Skill from '../models/skill.model'
import Language from '../models/language.model'
import Availability from '../models/availability.model'

import logger from '../utils/logger/logger'
import { BadRequestException } from '../utils/exception/catch-errors'
import { ErrorCode } from '../constants/enums/error-code.enum'
import { OnboardingSchemaType } from '../validation/onboarding.validation'
import { EducationType } from '../@types/onboarding'

export const onboardInstructor = async (
    body: OnboardingSchemaType,
    userId: string
) => {
    const instructor = await User.findByPk(userId)
    if (!instructor) {
        logger.warn(`Login failed: Instructor with id ${userId} not found`)
        throw new BadRequestException(
            'Invalid email or password provided',
            ErrorCode.AUTH_USER_NOT_FOUND
        )
    }

    const {
        education,
        skills,
        languages,
        bio,
        githubUrl,
        linkedinUrl,
        availability,
    } = body as OnboardingSchemaType
    console.log('availability', availability)

    logger.info(`Onboarding instructor ${instructor.email}`)

    // Creating instructor profile
    const instructorProfile = await InstructorProfiles.create({
        instructorId: userId,
        bio,
        githubUrl,
        linkedinUrl,
        basePrice: 100,
        level: 'beginner',
    })
    logger.info(
        `Created instructor profile : instructor : ${instructorProfile.id}`
    )

    // Creating educations for the instructor
    const education_qualifications = education.map(
        (education: EducationType) => ({
            instructorProfileId: instructorProfile.id,
            universityName: education.universityName,
            degree: education.degree,
            degreeType: education.degreeType,
            startYear: parseInt(education.startYear.toString()),
            endYear: parseInt(education.endYear.toString()),
            cgpa: parseFloat(education.cgpa.toString()),
            transcriptUrl: education.transcript?.url || '',
        })
    )

    await Education.bulkCreate(education_qualifications, {
        ignoreDuplicates: true,
        returning: false,
    })
    logger.info(`Created instructor educations`)

    // Adding skills for the instructor
    const skillPromises = skills.map((skillName: string) => ({
        instructorProfileId: instructorProfile.id,
        name: skillName,
    }))
    await Skill.bulkCreate(skillPromises, {
        ignoreDuplicates: true,
        returning: false,
    })
    logger.info(`Skills added for the instructors`)

    // Adding languages
    const languagePromises = languages.map((languageName: string) => ({
        instructorProfileId: instructorProfile.id,
        name: languageName,
    }))
    await Language.bulkCreate(languagePromises, {
        ignoreDuplicates: true,
        returning: false,
    })
    logger.info(`Languages added for the instructors`)

    const availabilitySlotsToCreate = []

    // Loop through the availability object (e.g., ['Monday', { isEnabled: true, slots: [...] }])
    for (const [day, dayData] of Object.entries(availability)) {
        // We only process days that the instructor has marked as available
        if (dayData.isEnabled && dayData.slots.length > 0) {
            // For each enabled day, loop through its time slots
            for (const slot of dayData.slots) {
                availabilitySlotsToCreate.push({
                    instructorProfileId: instructorProfile.id,
                    dayOfWeek: day,
                    startTime: slot.from,
                    endTime: slot.to,
                })
            }
        }
    }

    // If there are any slots to create, bulk insert them for efficiency
    if (availabilitySlotsToCreate.length > 0) {
        await Availability.bulkCreate(availabilitySlotsToCreate, {
            returning: false,
            ignoreDuplicates: true,
        })
        logger.info(`Availability slots created for instructor`)
    }

    // Need to mark the user as onboarded
    instructor.onboarded = true
    await instructor.save()

    logger.info(`Instructor onboarded successfully`)

    return {
        instructorProfile,
    }
}

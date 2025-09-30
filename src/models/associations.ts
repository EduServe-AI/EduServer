import User from './user.model'
import InstructorProfiles from './instructorprofile.model'
import { UserEducation } from './education.model'
import Skill from './skill.model'
import Language from './language.model'
// import Availability from './availability.model'
import UserSkill from './userSkill.model'
import UserLanguage from './userLanguage.model'
import InstructorAvailability from './instructorAvailability.model'
import AvailabilityTimeSlot from './timeSlot.model'
import EducationLevel from './educationLevel.model'
import DayOfWeek from './dayofWeek.model'

// setting up associations
export const setUpAssociations = () => {
    // one user can be one instructor --- > One to One Relationship
    User.hasOne(InstructorProfiles, {
        foreignKey: 'userId',
        as: 'instructorProfile',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })

    InstructorProfiles.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    })

    // one instructor profile can have many educations
    User.hasMany(UserEducation, {
        foreignKey: 'userId',
        as: 'educations',
    })

    UserEducation.belongsTo(User, {
        foreignKey: 'userId',
        as: 'instructorProfile',
    })

    // one instructor can have many skills
    User.hasMany(UserSkill, {
        foreignKey: 'userId',
        as: 'skills',
    })

    UserSkill.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    })

    // one instructor can know multiple languages
    User.hasMany(UserLanguage, {
        foreignKey: 'userId',
        as: 'languages',
    })

    UserLanguage.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    })

    // one instructor can be available at multiple days
    User.hasMany(InstructorAvailability, {
        foreignKey: 'userId',
        as: 'availabilities',
    })

    InstructorAvailability.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    })

    // each availability can have multiple timeslots within a day
    InstructorAvailability.hasMany(AvailabilityTimeSlot, {
        foreignKey: 'availabilityId',
        as: 'time_slots',
    })

    AvailabilityTimeSlot.belongsTo(InstructorAvailability, {
        foreignKey: 'availabilityId',
        as: 'availability',
    })

    // ----------- relationships between master table and reference table --------------

    // EducationLevel and UserEducation --- one to many relationship
    // one education type ( bachelors , masters etc.,) can be studied by many users (or instructors)

    EducationLevel.hasMany(UserEducation, {
        foreignKey: 'educationLevelId',
        as: 'userEducations', // alias for the collection of user educations
    })

    UserEducation.belongsTo(EducationLevel, {
        foreignKey: 'educationLevelId',
        as: 'educationLevel', // alias for the single education level
    })

    // Skill and UserSkill ---- one to many relationship
    // one skill can be possessed by many users (or instructors)
    Skill.hasMany(UserSkill, {
        foreignKey: 'skillId',
        as: 'userSkills', // alias for the collection of user skills
    })

    UserSkill.belongsTo(Skill, {
        foreignKey: 'skillId',
        as: 'skill', // alias for the single skill
    })

    // Language and UserLanguage ---- one to many relationship
    // one language can be known by many users (or instructors)
    Language.hasMany(UserLanguage, {
        foreignKey: 'languageId',
        as: 'userLanguages', // alias for the collection of user languages
    })

    UserLanguage.belongsTo(Language, {
        foreignKey: 'languageId',
        as: 'language', // alias for the single language
    })

    // DayOfWeek and InstructorAvailability --- one to many relationship
    // On one day (sun, mon , ... ) , many instructors can be availabile
    DayOfWeek.hasMany(InstructorAvailability, {
        foreignKey: 'dayOfWeekId',
        as: 'instructorAvailabilities', // alias for the collection of instructoravailabilities
    })

    InstructorAvailability.belongsTo(DayOfWeek, {
        foreignKey: 'dayOfWeekId',
        as: 'dayOfWeek', // alias for the single dayofweek instance
    })

    // ------------------------------- past relationships ------------------------------

    // one instructor can have many skills
    // InstructorProfiles.hasMany(Skill, {
    //     foreignKey: 'instructorProfileId',
    //     as: 'skills',
    // })

    // Skill.belongsTo(InstructorProfiles, {
    //     foreignKey: 'instructorProfileId',
    //     as: 'instructorProfile',
    // })

    // // one instructor can have many languages
    // InstructorProfiles.hasMany(Language, {
    //     foreignKey: 'instructorProfileId',
    //     as: 'languages',
    // })

    // Language.belongsTo(InstructorProfiles, {
    //     foreignKey: 'instructorProfileId',
    //     as: 'instructorProfile',
    // })

    // // Add new association for Availability
    // InstructorProfiles.hasMany(Availability, {
    //     foreignKey: 'instructorProfileId',
    //     as: 'availabilities',
    //     onDelete: 'CASCADE',
    //     onUpdate: 'CASCADE',
    // })

    // Availability.belongsTo(InstructorProfiles, {
    //     foreignKey: 'instructorProfileId',
    //     as: 'instructorProfile',
    // })
}

export { User, InstructorProfiles, UserEducation, Language, Skill }

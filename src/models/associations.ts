import User from './user.model'
import InstructorProfiles from './instructorprofile.model'
import Education from './education.model'
import Skill from './skill.model'
import Language from './language.model'
import Availability from './availability.model'

// setting up associations
export const setUpAssociations = () => {
    // one user can be one instructor --- > One to One Relationship
    User.hasOne(InstructorProfiles, {
        foreignKey: 'instructorId',
        as: 'instructorProfile',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })

    InstructorProfiles.belongsTo(User, {
        foreignKey: 'instructorId',
        as: 'user',
    })

    // one instructor profile can have many educations
    InstructorProfiles.hasMany(Education, {
        foreignKey: 'instructorProfileId',
        as: 'educations',
    })

    Education.belongsTo(InstructorProfiles, {
        foreignKey: 'instructorProfileId',
        as: 'instructorProfile',
    })

    // one instructor can have many skills
    InstructorProfiles.hasMany(Skill, {
        foreignKey: 'instructorProfileId',
        as: 'skills',
    })

    Skill.belongsTo(InstructorProfiles, {
        foreignKey: 'instructorProfileId',
        as: 'instructorProfile',
    })

    // one instructor can have many languages
    InstructorProfiles.hasMany(Language, {
        foreignKey: 'instructorProfileId',
        as: 'languages',
    })

    Language.belongsTo(InstructorProfiles, {
        foreignKey: 'instructorProfileId',
        as: 'instructorProfile',
    })

    // Add new association for Availability
    InstructorProfiles.hasMany(Availability, {
        foreignKey: 'instructorProfileId',
        as: 'availabilities',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })

    Availability.belongsTo(InstructorProfiles, {
        foreignKey: 'instructorProfileId',
        as: 'instructorProfile',
    })
}

export { User, InstructorProfiles, Education, Language, Skill }

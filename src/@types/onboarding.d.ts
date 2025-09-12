export interface EducationType {
    universityName: string
    degree: string
    degreeType: string
    startYear: string | number
    endYear: string | number
    cgpa: string | number
    transcript: {
        name: string
        url: string
    } | null
}

import { z } from 'zod';

const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const pincodeRegex = /^\d{6}$/;

export const fullSchema = z.object({
  // Step 1 – Personal
  fullName: z.string().min(2, 'Full name is required (min 2 characters)').max(100),
  preferredName: z.string().max(50).optional().or(z.literal('')),
  gender: z.string().min(1, 'Please select a gender'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  maritalStatus: z.string().optional().or(z.literal('')),
  nationality: z.string().optional().or(z.literal('')),
  bloodGroup: z.string().optional().or(z.literal('')),
  personalEmail: z.string().email('Enter a valid email address'),
  mobile: z.string().regex(phoneRegex, 'Enter a valid mobile number'),
  alternateNumber: z.string().regex(phoneRegex, 'Enter a valid number').optional().or(z.literal('')),
  profilePhoto: z.any().optional(),

  // Step 2 – Address
  currentAddress: z.string().min(5, 'Please enter your current address'),
  currentCity: z.string().min(1, 'City is required'),
  currentState: z.string().min(1, 'State is required'),
  currentCountry: z.string().min(1, 'Country is required'),
  currentPincode: z.string().regex(pincodeRegex, 'Enter a valid 6-digit pincode'),
  permanentAddress: z.string().min(5, 'Please enter your permanent address'),
  permanentCity: z.string().min(1, 'City is required'),
  permanentState: z.string().min(1, 'State is required'),
  permanentCountry: z.string().min(1, 'Country is required'),
  permanentPincode: z.string().regex(pincodeRegex, 'Enter a valid 6-digit pincode'),

  // Step 3 – Employment
  employeeType: z.enum(['employee', 'intern'], { required_error: 'Please select employee or intern' }),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  employeeId: z.string().optional().or(z.literal('')),
  reportingManager: z.string().optional().or(z.literal('')),
  dateOfJoining: z.string().min(1, 'Date of joining is required'),
  workLocation: z.string().optional().or(z.literal('')),
  employmentType: z.string().min(1, 'Employment type is required'),

  // Step 4 – Education
  highestQualification: z.string().min(1, 'Please select your qualification'),
  university: z.string().min(2, 'University/college name is required'),
  yearOfPassing: z.string().min(1, 'Year of passing is required'),
  percentage: z.string().min(1, 'Percentage/CGPA is required'),
  additionalEducation: z.array(z.object({
    degree: z.string().optional(),
    institution: z.string().optional(),
    year: z.string().optional(),
    grade: z.string().optional(),
  })).optional(),

  // Step 5 – Professional
  yearsOfExperience: z.string().optional().or(z.literal('')),
  previousCompany: z.string().optional().or(z.literal('')),
  previousDesignation: z.string().optional().or(z.literal('')),
  linkedin: z.string().url('Enter a valid LinkedIn URL').optional().or(z.literal('')),
  portfolio: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),

  // Step 6 – Identity
  aadhaar: z.string().regex(/^\d{4}\s?\d{4}\s?\d{4}$/, 'Enter a valid 12-digit Aadhaar').optional().or(z.literal('')),
  pan: z.string().regex(panRegex, 'Enter a valid PAN (e.g. ABCDE1234F)').optional().or(z.literal('')),
  passport: z.string().optional().or(z.literal('')),
  drivingLicense: z.string().optional().or(z.literal('')),
  aadhaarFile: z.any().optional(),
  panFile: z.any().optional(),
  resumeFile: z.any().optional(),

  // Step 7 – Emergency
  emergencyName: z.string().min(2, 'Emergency contact name is required'),
  emergencyRelationship: z.string().min(1, 'Relationship is required'),
  emergencyMobile: z.string().regex(phoneRegex, 'Enter a valid mobile number'),
  emergencyAlternate: z.string().regex(phoneRegex, 'Enter a valid number').optional().or(z.literal('')),
  emergencyAddress: z.string().optional().or(z.literal('')),

  // Step 8 – Banking
  accountHolderName: z.string().optional().or(z.literal('')),
  bankName: z.string().optional().or(z.literal('')),
  branchName: z.string().optional().or(z.literal('')),
  accountNumber: z.string().optional().or(z.literal('')),
  ifscCode: z.string().optional().or(z.literal('')).refine(val => !val || ifscRegex.test(val), {
    message: 'Enter a valid IFSC code (e.g. HDFC0001234)',
  }),
  upiId: z.string().optional().or(z.literal('')),

  // Step 9 – Declaration
  declaration: z.boolean().refine(v => v === true, 'You must accept the declaration'),
  signature: z.any().optional(),
});

// Per-step schemas for partial validation
export const stepSchemas = {
  1: fullSchema.pick({
    fullName: true, gender: true, dateOfBirth: true,
    personalEmail: true, mobile: true,
  }),
  2: fullSchema.pick({
    currentAddress: true, currentCity: true, currentState: true,
    currentCountry: true, currentPincode: true,
    permanentAddress: true, permanentCity: true, permanentState: true,
    permanentCountry: true, permanentPincode: true,
  }),
  3: fullSchema.pick({
    employeeType: true, department: true, designation: true,
    dateOfJoining: true, employmentType: true,
  }),
  4: fullSchema.pick({
    highestQualification: true, university: true, yearOfPassing: true, percentage: true,
  }),
  5: z.object({}).optional(), // Professional is all optional
  6: z.object({}).optional(), // Identity is all optional
  7: fullSchema.pick({
    emergencyName: true, emergencyRelationship: true, emergencyMobile: true,
  }),
  8: fullSchema.pick({
    accountHolderName: true, bankName: true, accountNumber: true, ifscCode: true,
  }),
  9: fullSchema.pick({ declaration: true }),
};

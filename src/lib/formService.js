import { supabase } from './supabase';

// ─────────────────────────────────────────────
//  Storage bucket names (create these in Supabase)
// ─────────────────────────────────────────────
const BUCKET = 'onboarding-documents';

// ─────────────────────────────────────────────
//  Generate unique employee code
// ─────────────────────────────────────────────
export function generateEmployeeCode(data) {
  const dept = (data.department || 'GEN').slice(0, 3).toUpperCase();
  const type = data.employeeType === 'intern' ? 'INT' : 'EMP';
  const id = Math.floor(Math.random() * 90000 + 10000);
  return `UNAI-${type}-${dept}-${id}`;
}

// ─────────────────────────────────────────────
//  Upload a single file to Supabase Storage
//  Returns the public URL or null on failure
// ─────────────────────────────────────────────
async function uploadFile(file, folder, employeeCode) {
  if (!file || !(file instanceof File)) return null;

  const ext = file.name.split('.').pop();
  const path = `${folder}/${employeeCode}_${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error(`[Storage] Upload failed for ${folder}:`, error.message);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return urlData?.publicUrl ?? null;
}

// ─────────────────────────────────────────────
//  Main submission — saves all form data to Supabase
// ─────────────────────────────────────────────
export async function submitOnboardingForm(formData) {
  const employeeCode = generateEmployeeCode(formData);

  // ── 1. Upload files concurrently ──────────────
  const [profilePhotoUrl, aadhaarFileUrl, panFileUrl, resumeFileUrl] =
    await Promise.all([
      uploadFile(formData.profilePhoto,  'profile-photos',  employeeCode),
      uploadFile(formData.aadhaarFile,   'aadhaar',         employeeCode),
      uploadFile(formData.panFile,       'pan',             employeeCode),
      uploadFile(formData.resumeFile,    'resumes',         employeeCode),
    ]);

  // ── 2. Insert main record ─────────────────────
  const { data: record, error: recordError } = await supabase
    .from('onboarding_submissions')
    .insert([{
      employee_code:        employeeCode,
      submitted_at:         new Date().toISOString(),

      // Personal
      full_name:            formData.fullName,
      preferred_name:       formData.preferredName || null,
      gender:               formData.gender,
      date_of_birth:        formData.dateOfBirth,
      marital_status:       formData.maritalStatus || null,
      nationality:          formData.nationality   || null,
      blood_group:          formData.bloodGroup    || null,
      personal_email:       formData.personalEmail,
      mobile:               formData.mobile,
      alternate_number:     formData.alternateNumber || null,
      profile_photo_url:    profilePhotoUrl,

      // Address
      current_address:      formData.currentAddress,
      current_city:         formData.currentCity,
      current_state:        formData.currentState,
      current_country:      formData.currentCountry,
      current_pincode:      formData.currentPincode,
      permanent_address:    formData.permanentAddress,
      permanent_city:       formData.permanentCity,
      permanent_state:      formData.permanentState,
      permanent_country:    formData.permanentCountry,
      permanent_pincode:    formData.permanentPincode,

      // Employment
      employee_type:        formData.employeeType,
      department:           formData.department,
      designation:          formData.designation,
      employee_id_provided: formData.employeeId    || null,
      reporting_manager:    formData.reportingManager || null,
      date_of_joining:      formData.dateOfJoining,
      work_location:        formData.workLocation   || null,
      employment_type:      formData.employmentType,

      // Education
      highest_qualification: formData.highestQualification,
      university:            formData.university,
      year_of_passing:       formData.yearOfPassing,
      percentage:            formData.percentage,
      additional_education:  formData.additionalEducation || [],

      // Professional
      years_of_experience:   formData.yearsOfExperience  || null,
      previous_company:      formData.previousCompany     || null,
      previous_designation:  formData.previousDesignation || null,
      linkedin:              formData.linkedin            || null,
      portfolio:             formData.portfolio           || null,
      skills:                formData.skills              || [],

      // Identity
      aadhaar_number:        formData.aadhaar       || null,
      pan_number:            formData.pan           || null,
      passport_number:       formData.passport      || null,
      driving_license:       formData.drivingLicense || null,
      aadhaar_file_url:      aadhaarFileUrl,
      pan_file_url:          panFileUrl,
      resume_url:            resumeFileUrl,

      // Emergency
      emergency_name:         formData.emergencyName,
      emergency_relationship: formData.emergencyRelationship,
      emergency_mobile:       formData.emergencyMobile,
      emergency_alternate:    formData.emergencyAlternate  || null,
      emergency_address:      formData.emergencyAddress    || null,

      // Banking
      account_holder_name:   formData.accountHolderName || null,
      bank_name:             formData.bankName || null,
      branch_name:           formData.branchName      || null,
      account_number:        formData.accountNumber || null,
      ifsc_code:             formData.ifscCode || null,
      upi_id:                formData.upiId           || null,

      // Assets & Declaration
      assets_requested:      formData.assets          || [],
      declaration_accepted:  formData.declaration,
      has_signature:         !!formData.signature,
      status:                'pending',
    }])
    .select()
    .single();

  if (recordError) {
    console.error('[Supabase] Insert failed:', recordError.message);
    throw new Error(recordError.message);
  }

  return {
    ...formData,
    employeeCode,
    profilePhotoUrl,
    submissionId: record.id,
  };
}

// ─────────────────────────────────────────────
//  Fetch all submissions (for admin)
// ─────────────────────────────────────────────
export async function getAllSubmissions() {
  const { data, error } = await supabase
    .from('onboarding_submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// ─────────────────────────────────────────────
//  Update submission status & notes (for admin)
// ─────────────────────────────────────────────
export async function updateSubmissionStatus(id, status, notes = '') {
  const { data, error } = await supabase
    .from('onboarding_submissions')
    .update({
      status,
      review_notes: notes,
      reviewed_by: 'HR Admin',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─────────────────────────────────────────────
//  Fetch a single submission by employee code
// ─────────────────────────────────────────────
export async function getSubmissionByCode(employeeCode) {
  const { data, error } = await supabase
    .from('onboarding_submissions')
    .select('*')
    .eq('employee_code', employeeCode)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

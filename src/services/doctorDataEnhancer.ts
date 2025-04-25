
import { Doctor } from './doctorService';

// Function to enhance doctor data with missing properties
export const enhanceDoctorData = (doctors: Doctor[]): Doctor[] => {
  return doctors.map((doctor) => {
    // Add consultation type if not present
    // Randomly assign video consult, in clinic, or both
    if (!doctor.consultationType) {
      const rand = Math.floor(Math.random() * 3);
      let consultationType: string[] = [];
      
      if (rand === 0) consultationType = ['video'];
      else if (rand === 1) consultationType = ['clinic'];
      else consultationType = ['video', 'clinic'];
      
      return { ...doctor, consultationType };
    }
    
    return doctor;
  });
};

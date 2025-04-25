
import { useQuery } from "@tanstack/react-query";
import { enhanceDoctorData } from './doctorDataEnhancer';

export interface Doctor {
  name: string;
  specialty?: string[];     // Make specialty optional as it might not exist in original data
  specialities?: { name: string }[]; // Add specialities field from API response
  city: string;
  address: string;
  experience: number;
  ratings: number;
  numberOfReviews: number;
  fees: number;
  availability: string;
  image?: string;
  consultationType?: string[];
}

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

// Helper function to map API response to our Doctor interface
const mapApiResponseToDoctors = (apiResponse: any[]): Doctor[] => {
  return apiResponse.map(item => {
    // Map the API response to our Doctor interface
    const doctor: Doctor = {
      name: item.name,
      // Extract specialty from specialities array
      specialty: item.specialities?.map((s: { name: string }) => s.name) || [],
      city: item.clinic?.address?.city || '',
      address: item.clinic?.address?.address_line1 || '',
      // Extract numeric experience value
      experience: parseInt(item.experience?.split(' ')[0]) || 0,
      ratings: 4.5, // Default since not in API
      numberOfReviews: Math.floor(Math.random() * 100) + 10, // Random reviews since not in API
      // Extract numeric fees value
      fees: parseInt(item.fees?.replace(/[^\d]/g, '')) || 0,
      availability: "Available Today", // Default since not in API
      image: item.photo || undefined,
    };
    
    return doctor;
  });
};

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async (): Promise<Doctor[]> => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const data = await response.json();
      const mappedDoctors = mapApiResponseToDoctors(data);
      return enhanceDoctorData(mappedDoctors);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const getAllSpecialties = (doctors: Doctor[]): string[] => {
  const specialtySet = new Set<string>();
  
  doctors.forEach(doctor => {
    // Check if specialty exists and is an array before trying to iterate
    if (doctor.specialty && Array.isArray(doctor.specialty)) {
      doctor.specialty.forEach(specialty => {
        specialtySet.add(specialty);
      });
    }
  });
  
  return Array.from(specialtySet).sort();
};

// Function to filter doctors based on search term, consultation type, and specialties
export const filterDoctors = (
  doctors: Doctor[],
  searchTerm: string,
  consultationType: string | null,
  selectedSpecialties: string[],
  sortBy: string | null
): Doctor[] => {
  // Apply filters
  let filteredDoctors = [...doctors];
  
  // Filter by search term
  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
  
  // Filter by consultation type
  if (consultationType) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.consultationType?.includes(consultationType)
    );
  }
  
  // Filter by specialties
  if (selectedSpecialties.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor => {
      if (!doctor.specialty || !Array.isArray(doctor.specialty)) return false;
      return selectedSpecialties.some(specialty => doctor.specialty!.includes(specialty));
    });
  }
  
  // Sort doctors
  if (sortBy === 'fees') {
    filteredDoctors.sort((a, b) => a.fees - b.fees);
  } else if (sortBy === 'experience') {
    filteredDoctors.sort((a, b) => b.experience - a.experience);
  }
  
  return filteredDoctors;
};

// Function to get search suggestions
export const getSearchSuggestions = (
  doctors: Doctor[], 
  searchTerm: string
): Doctor[] => {
  if (!searchTerm) return [];
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return doctors
    .filter(doctor => 
      doctor.name.toLowerCase().includes(lowerCaseSearchTerm)
    )
    .slice(0, 3);
};

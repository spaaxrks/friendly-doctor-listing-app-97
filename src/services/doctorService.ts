
import { useQuery } from "@tanstack/react-query";
import { enhanceDoctorData } from './doctorDataEnhancer';

export interface Doctor {
  name: string;
  specialty: string[];
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

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async (): Promise<Doctor[]> => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const data = await response.json();
      return enhanceDoctorData(data);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const getAllSpecialties = (doctors: Doctor[]): string[] => {
  const specialtySet = new Set<string>();
  
  doctors.forEach(doctor => {
    doctor.specialty.forEach(specialty => {
      specialtySet.add(specialty);
    });
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
    filteredDoctors = filteredDoctors.filter(doctor => 
      selectedSpecialties.some(specialty => doctor.specialty.includes(specialty))
    );
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


import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { 
  useDoctors, 
  getAllSpecialties, 
  filterDoctors, 
  Doctor 
} from '@/services/doctorService';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import DoctorsList from '@/components/DoctorsList';

const Index = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get query params
  const searchQuery = searchParams.get('search') || '';
  const consultationType = searchParams.get('consultation');
  const specialtiesParam = searchParams.get('specialties');
  const sortBy = searchParams.get('sort');
  
  // Parse specialties from query param
  const initialSpecialties = specialtiesParam ? specialtiesParam.split(',') : [];
  
  // Local state
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedConsultationType, setSelectedConsultationType] = useState<string | null>(consultationType);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(initialSpecialties);
  const [selectedSortBy, setSelectedSortBy] = useState<string | null>(sortBy);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  
  // Fetch doctors data
  const { data: doctors = [], isLoading, error } = useDoctors();
  
  // Get all unique specialties
  const allSpecialties = doctors.length > 0 ? getAllSpecialties(doctors) : [];
  
  // Effect to update filtered doctors when filters change
  useEffect(() => {
    if (doctors.length > 0) {
      const filtered = filterDoctors(
        doctors,
        searchTerm,
        selectedConsultationType,
        selectedSpecialties,
        selectedSortBy
      );
      setFilteredDoctors(filtered);
    }
  }, [doctors, searchTerm, selectedConsultationType, selectedSpecialties, selectedSortBy]);
  
  // Effect to update URL params when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    if (searchTerm) newSearchParams.set('search', searchTerm);
    if (selectedConsultationType) newSearchParams.set('consultation', selectedConsultationType);
    if (selectedSpecialties.length > 0) newSearchParams.set('specialties', selectedSpecialties.join(','));
    if (selectedSortBy) newSearchParams.set('sort', selectedSortBy);
    
    setSearchParams(newSearchParams);
  }, [searchTerm, selectedConsultationType, selectedSpecialties, selectedSortBy, setSearchParams]);
  
  // Handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleConsultationTypeChange = (type: string) => {
    setSelectedConsultationType(type === selectedConsultationType ? null : type);
  };
  
  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(item => item !== specialty)
        : [...prev, specialty]
    );
  };
  
  const handleSortChange = (option: string) => {
    setSelectedSortBy(option === selectedSortBy ? null : option);
  };
  
  // Show error if API fetch fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading doctors",
        description: "There was a problem fetching the doctor list. Please try again later.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search bar */}
      <header className="bg-medical-blue py-4 px-4 md:px-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Find a Doctor</h1>
          <SearchBar 
            doctors={doctors} 
            onSearch={handleSearch} 
            initialSearchTerm={searchQuery}
          />
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="md:col-span-1">
            <FilterPanel 
              specialties={allSpecialties}
              selectedSpecialties={selectedSpecialties}
              consultationType={selectedConsultationType}
              sortBy={selectedSortBy}
              onSpecialtyChange={handleSpecialtyChange}
              onConsultationTypeChange={handleConsultationTypeChange}
              onSortChange={handleSortChange}
            />
          </div>
          
          {/* Doctor listing */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {isLoading ? 'Loading doctors...' : `${filteredDoctors.length} Doctor${filteredDoctors.length !== 1 ? 's' : ''} found`}
              </h2>
            </div>
            <DoctorsList doctors={filteredDoctors} loading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

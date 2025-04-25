
import React from 'react';
import DoctorCard from './DoctorCard';
import { Doctor } from '@/services/doctorService';

interface DoctorsListProps {
  doctors: Doctor[];
  loading: boolean;
}

const DoctorsList: React.FC<DoctorsListProps> = ({ doctors, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">No doctors found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="doctors-list">
      {doctors.map((doctor, index) => (
        <DoctorCard key={index} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorsList;

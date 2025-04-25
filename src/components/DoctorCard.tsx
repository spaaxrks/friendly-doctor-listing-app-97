
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Doctor } from '@/services/doctorService';
import { MapPin, Video } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid="doctor-card">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Doctor Image */}
          <div className="md:w-1/4 bg-medical-light p-4 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {doctor.image ? (
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-3xl font-bold text-medical-blue">
                  {doctor.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          {/* Doctor Info */}
          <div className="p-5 md:w-3/4">
            <div className="flex flex-col md:flex-row justify-between mb-3">
              <h3 className="text-xl font-bold text-medical-dark mb-1" data-testid="doctor-name">{doctor.name}</h3>
              <div className="flex items-center">
                {doctor.consultationType?.includes("video") && (
                  <Badge className="bg-medical-blue text-white mr-2 flex items-center gap-1">
                    <Video size={14} />
                    <span>Video Consult</span>
                  </Badge>
                )}
                {doctor.consultationType?.includes("clinic") && (
                  <Badge className="bg-medical-accent text-white flex items-center gap-1">
                    <MapPin size={14} />
                    <span>In Clinic</span>
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="mb-3" data-testid="doctor-specialty">
              {doctor.specialty?.map((spec) => (
                <Badge key={spec} variant="outline" className="mr-2 mb-2">
                  {spec}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div data-testid="doctor-experience">
                <p className="text-gray-500">Experience</p>
                <p className="font-semibold">{doctor.experience} years</p>
              </div>
              <div data-testid="doctor-fee">
                <p className="text-gray-500">Fees</p>
                <p className="font-semibold">₹{doctor.fees}</p>
              </div>
              <div>
                <p className="text-gray-500">Rating</p>
                <p className="font-semibold">{doctor.ratings} ({doctor.numberOfReviews} reviews)</p>
              </div>
              <div>
                <p className="text-gray-500">Availability</p>
                <p className="font-semibold">{doctor.availability}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-500 text-sm flex items-center">
                <MapPin size={16} className="mr-1" /> 
                {doctor.city}, {doctor.address}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;

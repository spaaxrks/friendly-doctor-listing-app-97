
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface FilterPanelProps {
  specialties: string[];
  selectedSpecialties: string[];
  consultationType: string | null;
  sortBy: string | null;
  onSpecialtyChange: (specialty: string) => void;
  onConsultationTypeChange: (type: string) => void;
  onSortChange: (sortOption: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  specialties,
  selectedSpecialties,
  consultationType,
  sortBy,
  onSpecialtyChange,
  onConsultationTypeChange,
  onSortChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-bold text-lg mb-4 text-medical-dark">Filters</h2>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-sm uppercase text-gray-600" data-testid="filter-header-moc">Consultation Type</h3>
        <RadioGroup 
          value={consultationType || ""} 
          onValueChange={onConsultationTypeChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="video" 
              id="video-consult"
              data-testid="filter-video-consult"
            />
            <Label htmlFor="video-consult">Video Consult</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="clinic" 
              id="in-clinic"
              data-testid="filter-in-clinic"
            />
            <Label htmlFor="in-clinic">In Clinic</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator className="my-4" />
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-sm uppercase text-gray-600" data-testid="filter-header-speciality">Specialties</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {specialties.map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox 
                id={`specialty-${specialty}`}
                checked={selectedSpecialties.includes(specialty)}
                onCheckedChange={() => onSpecialtyChange(specialty)}
                data-testid={`filter-specialty-${specialty.toLowerCase().replace(/\s+/g, '-')}`}
              />
              <Label htmlFor={`specialty-${specialty}`}>{specialty}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="font-semibold mb-2 text-sm uppercase text-gray-600" data-testid="filter-header-sort">Sort By</h3>
        <RadioGroup 
          value={sortBy || ""} 
          onValueChange={onSortChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="fees" 
              id="sort-fees"
              data-testid="sort-by-fees"
            />
            <Label htmlFor="sort-fees">Fees (Low to High)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="experience" 
              id="sort-experience"
              data-testid="sort-by-experience"
            />
            <Label htmlFor="sort-experience">Experience (High to Low)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default FilterPanel;

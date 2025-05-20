
import React from 'react';

interface SubCategory {
  id: number;
  name: string;
  [key: string]: any;
}

interface SubCategoryButtonsProps {
  subCategories: SubCategory[];
  activeSubCategory: number | null;
  onSelect: (id: number) => void;
}

const SubCategoryButtons: React.FC<SubCategoryButtonsProps> = ({ 
  subCategories, 
  activeSubCategory, 
  onSelect 
}) => {
  return (
    <div className="scroll-container overflow-x-auto py-2 flex flex-nowrap">
      {subCategories?.map((subcat) => (
        <button
          key={subcat.id}
          className={`category-pill whitespace-nowrap mr-2 ${activeSubCategory === subcat.id ? 'category-pill-active' : ''}`}
          onClick={() => onSelect(subcat.id)}
        >
          {subcat.name}
        </button>
      ))}
    </div>
  );
};

export default SubCategoryButtons;

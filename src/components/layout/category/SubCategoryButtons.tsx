
import React from 'react';

const SubCategoryButtons = ({ subCategories, activeSubCategory, onSelect }: { 
  subCategories: any[];
  activeSubCategory: number | null;
  onSelect: (id: number) => void;
}) => {
  return (
    <div className="scroll-container no-scrollbar py-2">
      {subCategories?.map((subcat) => (
        <button
          key={subcat.id}
          className={`category-pill mr-2 ${activeSubCategory === subcat.id ? 'category-pill-active' : ''}`}
          onClick={() => onSelect(subcat.id)}
        >
          {subcat.name}
        </button>
      ))}
    </div>
  );
};

export default SubCategoryButtons;

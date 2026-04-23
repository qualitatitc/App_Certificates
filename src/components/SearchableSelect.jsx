
import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function SearchableSelect({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Memoize filtered options for performance
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options.slice(0, 50); // Show top 50 if empty
    
    const term = searchTerm.toLowerCase();
    return options
      .filter(opt => 
        String(opt.code || '').toLowerCase().includes(term) || 
        String(opt.esDesc || '').toLowerCase().includes(term)
      )
      .slice(0, 50); // Limit to 50 results for performance and readability
  }, [options, searchTerm]);

  // Handle value change from outside (reset search term)
  useEffect(() => {
    const selected = options.find(opt => opt.id === value);
    if (selected && !isOpen) {
      setSearchTerm(`${selected.code} - ${selected.esDesc}`);
    } else if (!value && !isOpen) {
      setSearchTerm('');
    }
  }, [value, options, isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset search term to the selected value if it exists
        const selected = options.find(opt => opt.id === value);
        setSearchTerm(selected ? `${selected.code} - ${selected.esDesc}` : '');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, options]);

  const handleSelect = (option) => {
    onChange(option.id);
    setSearchTerm(`${option.code} - ${option.esDesc}`);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          handleSelect(filteredOptions[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="searchable-select-container" ref={containerRef}>
      <div className="searchable-select-input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm(''); // Clear on focus to allow fresh search
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <div className="searchable-select-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option.id}
                className={`searchable-select-option ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className="option-code">{option.code}</span>
                <span className="option-desc">{option.esDesc}</span>
              </div>
            ))
          ) : (
            <div className="no-results">No se encontraron artículos</div>
          )}
        </div>
      )}
    </div>
  );
}

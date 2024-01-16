import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Option {
  [key: string]: any;
}

interface ChipComponentProps {
  options: Option[];
  nameKey: string;
  emailKey: string;
  imageKey?: string;
}

const ChipComponent: React.FC<ChipComponentProps> = ({ options, nameKey, emailKey, imageKey }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<Option[]>([]);
  const remainingValuesRef = useRef<Option[]>(options);
  const [highlightedIndex, setHighLightedIndex] = useState<number|null>(null);
  const [toDeleteIndex, setToDeleteIndex] = useState<number|null>(null);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [dropdownVisible,setDropdownVisible]= useState<Boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFilteredOptions(options);
    remainingValuesRef.current=options;
  }, [options]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
  
    setInputValue(value);

    setHighLightedIndex(null);
    const filtered = remainingValuesRef.current.filter(
      (option) =>
        option[nameKey].toString().toLowerCase().includes(value.toLowerCase())
    );
  
    setFilteredOptions(filtered);
  };
  
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && inputValue === '' && selectedValues.length > 0) {
      if(toDeleteIndex!==null){
        const toDeleteValue = selectedValues[toDeleteIndex];
        handleRemoveOption(toDeleteValue);
        setToDeleteIndex(null);
      }
      else{
        setToDeleteIndex(selectedValues.length-1);
      }
    }
    if (event.key === "ArrowRight") {
      setToDeleteIndex((prev)=>{
        if(prev===null) return 0;
        else  return (prev+1)%(selectedValues.length);
      });
    }
    if (event.key === 'ArrowLeft') {
      setToDeleteIndex((prev)=>{
        if(prev===null) return selectedValues.length-1;
        else  return (prev-1+selectedValues.length)%(selectedValues.length);
      });
    }
    if (event.key === 'ArrowDown') {
      setHighLightedIndex((prev)=>{
        if(prev===null) return 0;
        else  return (prev+1)%(filteredOptions.length);
      });
    }
    if (event.key === 'ArrowUp') {
      setHighLightedIndex((prev)=>{
        if(prev===null) return filteredOptions.length-1;
        else  return (prev-1+filteredOptions.length)%(filteredOptions.length);
      });
    }
    if (event.key === 'Enter' && highlightedIndex!==null) {
      handleOptionSelect(filteredOptions[highlightedIndex]);
    }
  };

  const handleOptionSelect = (selectedOption: Option) => {
    if (!selectedValues.find((option) => option === selectedOption)) {
      setSelectedValues([...selectedValues, selectedOption]);
      remainingValuesRef.current=remainingValuesRef.current.filter((option)=>option!==selectedOption);
      setInputValue('');
      setFilteredOptions(remainingValuesRef.current);
    }
  };


  const handleInputFocus = () => {
    setDropdownVisible(true);
  };

  const handleRemoveOption = (removedOption: Option) => {
    const updatedValues = selectedValues.filter((option) => option !== removedOption);
    remainingValuesRef.current = [removedOption,...remainingValuesRef.current];
    setSelectedValues(updatedValues);
    setFilteredOptions(remainingValuesRef.current); // Reset filtered options
  };

  const getImageSrc = (option: Option): string | undefined => {
    if (imageKey && option[imageKey]) {
      return option[imageKey];
    }
    return undefined;
  };

  return (
    <div style={{ position: 'relative', width:'70%', fontFamily: 'Arial, sans-serif' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          padding: 8,
          border: '1px solid #ccc',
          borderRadius: 4,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        {selectedValues.map((option, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor:'#f0f0f0',
              borderRadius: 100,
              borderColor: index===toDeleteIndex?'black':'#f0f0f0',
              border: '4px solid #ccc',
              padding: '4px 8px',
              marginRight: 4,
              marginBottom: 4,
              cursor: 'pointer',
            }}
          >
            {getImageSrc(option) && (
              <img
                src={getImageSrc(option)}
                alt={option[nameKey]}
                style={{ width: 20, height: 20, marginRight: 4 }}
              />
            )}
            {option[nameKey]+" "}
            <FontAwesomeIcon onClick={()=>handleRemoveOption(option)} icon={faTimesCircle} />
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          autoFocus
          placeholder={`Type to search by ${nameKey}...`}
          style={{
            border: 'none',
            outline: 'none',
            flexGrow: 1,
            padding: '8px',
            fontSize: '14px',
          }}
          ref={(ref) => {
            inputRef.current = ref;
          }}
        />
      </div>
      {filteredOptions.length > 0 && dropdownVisible && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            border: '1px solid #ccc',
            borderRadius: '4px',
            maxHeight: '40%',
          }}
        >
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 8,
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                justifyContent:'space-between',
                backgroundColor: highlightedIndex===index?'#ccc':'#fff',
              }}
              onClick={() => handleOptionSelect(option)}
            >
              <div>
              {getImageSrc(option) && (
                <img
                  src={getImageSrc(option)}
                  alt={option[nameKey]}
                  style={{ width: 20, height: 20, marginRight: 4 }}
                />
              )}
              {option[nameKey]}
              </div>
              {option[emailKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChipComponent;

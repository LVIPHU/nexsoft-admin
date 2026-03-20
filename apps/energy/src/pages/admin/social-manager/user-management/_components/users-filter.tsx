import { useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@nexsoft-admin/ui/input-group';

interface UsersFilterProps {
  keyword?: string;
  onSearch: (keyword: string) => void;
}

function UsersFilter({ keyword = '', onSearch }: UsersFilterProps) {
  const [value, setValue] = useState(keyword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    if (next === '') onSearch('');
  };

  const handleSearch = () => {
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className='flex flex-col gap-4 lg:flex-row'>
      <InputGroup>
        <InputGroupInput
          placeholder='Type to search...'
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton variant='secondary' onClick={handleSearch}>
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className='flex-grow'></div>
    </div>
  );
}

export { UsersFilter };

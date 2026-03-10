import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@nexsoft-admin/ui/input-group';

function UsersFilter() {
  return (
    <div className='flex flex-col gap-4 lg:flex-row'>
      <InputGroup>
        <InputGroupInput placeholder='Type to search...' />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton variant='secondary'>Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className='flex-grow'></div>
    </div>
  );
}

export { UsersFilter };

import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './table';

const meta: Meta<typeof Table> = {
  title: 'Organisms/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className='text-right'>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className='font-medium'>John Doe</TableCell>
          <TableCell>john.doe@example.com</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell className='text-right'>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>Jane Smith</TableCell>
          <TableCell>jane.smith@example.com</TableCell>
          <TableCell>User</TableCell>
          <TableCell className='text-right'>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>Bob Johnson</TableCell>
          <TableCell>bob.johnson@example.com</TableCell>
          <TableCell>User</TableCell>
          <TableCell className='text-right'>Inactive</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className='text-right'>Price</TableHead>
          <TableHead className='text-right'>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className='font-medium'>Laptop</TableCell>
          <TableCell>2</TableCell>
          <TableCell className='text-right'>$999.00</TableCell>
          <TableCell className='text-right'>$1,998.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>Mouse</TableCell>
          <TableCell>5</TableCell>
          <TableCell className='text-right'>$29.99</TableCell>
          <TableCell className='text-right'>$149.95</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>Keyboard</TableCell>
          <TableCell>3</TableCell>
          <TableCell className='text-right'>$79.99</TableCell>
          <TableCell className='text-right'>$239.97</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className='font-medium'>
            Total
          </TableCell>
          <TableCell className='text-right font-medium'>$2,387.92</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className='text-right'>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className='font-medium'>INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className='text-right'>$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className='text-right'>$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className='text-right'>$350.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>INV004</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className='text-right'>$450.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithSelectedRow: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className='text-right'>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className='font-medium'>John Doe</TableCell>
          <TableCell>john.doe@example.com</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell className='text-right'>Active</TableCell>
        </TableRow>
        <TableRow data-state='selected'>
          <TableCell className='font-medium'>Jane Smith</TableCell>
          <TableCell>jane.smith@example.com</TableCell>
          <TableCell>User</TableCell>
          <TableCell className='text-right'>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>Bob Johnson</TableCell>
          <TableCell>bob.johnson@example.com</TableCell>
          <TableCell>User</TableCell>
          <TableCell className='text-right'>Inactive</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Scrollable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className='font-medium'>1</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>john.doe@example.com</TableCell>
          <TableCell>+1 234 567 8900</TableCell>
          <TableCell>123 Main St</TableCell>
          <TableCell>New York</TableCell>
          <TableCell>USA</TableCell>
          <TableCell>Active</TableCell>
          <TableCell className='text-right'>Edit | Delete</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>2</TableCell>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane.smith@example.com</TableCell>
          <TableCell>+1 234 567 8901</TableCell>
          <TableCell>456 Oak Ave</TableCell>
          <TableCell>Los Angeles</TableCell>
          <TableCell>USA</TableCell>
          <TableCell>Active</TableCell>
          <TableCell className='text-right'>Edit | Delete</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='font-medium'>3</TableCell>
          <TableCell>Bob Johnson</TableCell>
          <TableCell>bob.johnson@example.com</TableCell>
          <TableCell>+1 234 567 8902</TableCell>
          <TableCell>789 Pine Rd</TableCell>
          <TableCell>Chicago</TableCell>
          <TableCell>USA</TableCell>
          <TableCell>Inactive</TableCell>
          <TableCell className='text-right'>Edit | Delete</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className='text-right'>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className='text-muted-foreground py-8 text-center'>
            No data available
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Dense: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='h-8'>Name</TableHead>
          <TableHead className='h-8'>Email</TableHead>
          <TableHead className='h-8'>Role</TableHead>
          <TableHead className='h-8 text-right'>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className='py-1 font-medium'>John Doe</TableCell>
          <TableCell className='py-1'>john.doe@example.com</TableCell>
          <TableCell className='py-1'>Admin</TableCell>
          <TableCell className='py-1 text-right'>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='py-1 font-medium'>Jane Smith</TableCell>
          <TableCell className='py-1'>jane.smith@example.com</TableCell>
          <TableCell className='py-1'>User</TableCell>
          <TableCell className='py-1 text-right'>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='py-1 font-medium'>Bob Johnson</TableCell>
          <TableCell className='py-1'>bob.johnson@example.com</TableCell>
          <TableCell className='py-1'>User</TableCell>
          <TableCell className='py-1 text-right'>Inactive</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Input, Avatar, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/products/UIComponents';
import axios from 'axios';
import api from './utils/api';

const CustomersComponent = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/customers');
        console.log(response.data)
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customers');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Customers</h2>
      <div className="flex justify-between items-center">
        <Input
          className="max-w-sm"
          placeholder="Search customers..."
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="text-sm text-gray">{filteredCustomers.length} customers</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Total Spent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer._id}>
              <TableCell className="flex items-center space-x-3">
                <Avatar>
                  {customer.avatar ? (
                    <img src={customer.avatar} alt={customer.username} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-6 h-6 text-blue-500" />
                  )}
                </Avatar>
                <span>{customer.username}</span>
              </TableCell>
              <TableCell>{customer.email || customer.phone}</TableCell>
              <TableCell>
                KsHs{customer.totalSpent ? customer.totalSpent.toFixed(2) : '0.00'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomersComponent;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MoreHorizontal, ChevronDown, Eye, Edit, Trash, RotateCw, MapPin, Clock } from 'lucide-react';
import { generateMockListing } from '@/lib/mock-data';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Generate mock listings for demo
const mockListings = Array.from({ length: 8 }, (_, i) => generateMockListing(i + 1));

const UserListings = () => {
  const [activeFilter, setActiveFilter] = useState({
    status: 'all',
    category: 'all',
    published: 'all'
  });

  const togglePublishStatus = (id: number, currentStatus: boolean) => {
    // In a real application, this would make an API call
    toast.success(`Listing ${currentStatus ? 'unpublished' : 'published'} successfully`);
  };

  const handleDelete = (id: number) => {
    // In a real application, this would make an API call or show a confirmation dialog
    toast.error('This would delete the listing in a real application');
  };

  const handleRenew = (id: number) => {
    // In a real application, this would make an API call
    toast.success('Listing renewed successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto">
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-lg overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Cover"
                className="w-full h-full object-cover opacity-50"
              />
            </div>
            
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 px-6 pb-4 -mb-16 relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden -mt-12 z-10">
                <img
                  src="/placeholder.svg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left md:pb-2">
                <h2 className="font-bold text-xl">John Smith</h2>
                <p className="text-muted-foreground text-sm">Member since January 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto pt-20 pb-10 px-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold mb-4 md:mb-0">My Listings</h2>
              <Button variant="default" className="bg-primary">
                <Link to="/post-ad" className="text-white">Post New Ad</Link>
              </Button>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={activeFilter.status}
                  onChange={(e) => setActiveFilter({...activeFilter, status: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="categoryFilter"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={activeFilter.category}
                  onChange={(e) => setActiveFilter({...activeFilter, category: e.target.value})}
                >
                  <option value="all">All Categories</option>
                  <option value="1">Cars</option>
                  <option value="2">Real Estate</option>
                  <option value="3">Electronics</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="publishedFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Publication
                </label>
                <select
                  id="publishedFilter"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={activeFilter.published}
                  onChange={(e) => setActiveFilter({...activeFilter, published: e.target.value})}
                >
                  <option value="all">All Publications</option>
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
            </div>
            
            {/* Listings */}
            <div className="space-y-4">
              {mockListings.map((listing, index) => {
                const isPublished = Math.random() > 0.5;
                const isApproved = Math.random() > 0.3;
                
                return (
                  <div 
                    key={listing.id}
                    className="bg-white border rounded-lg overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-1/5 lg:w-1/6 p-4">
                        <div className="aspect-video md:aspect-square rounded-md overflow-hidden bg-gray-100">
                          <img 
                            src={listing.image} 
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="md:w-3/5 lg:w-4/6 p-4 border-b md:border-b-0 md:border-l md:border-r">
                        <div className="flex flex-col h-full">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              <Link to={`/listing/${listing.id}`} className="hover:text-primary">
                                {listing.title}
                              </Link>
                            </h3>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {listing.is_featured && (
                                <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                                  Featured
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {listing.condition}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{listing.address}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Posted 2 days ago</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <span className="text-xl font-bold text-primary">
                              ${listing.price.toLocaleString()}
                              {listing.negotiable && (
                                <span className="text-xs font-normal text-muted-foreground ml-1">
                                  (Negotiable)
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="md:w-1/5 lg:w-1/6 p-4 flex flex-col items-center justify-center gap-4 bg-gray-50">
                        <div className="text-center">
                          <Badge className={`px-3 py-1 ${
                            isApproved 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}>
                            {isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-2 w-full">
                          <Switch 
                            id={`publish-${listing.id}`}
                            checked={isPublished}
                            onCheckedChange={() => togglePublishStatus(listing.id, isPublished)}
                          />
                          <label 
                            htmlFor={`publish-${listing.id}`}
                            className="text-sm cursor-pointer select-none"
                          >
                            {isPublished ? 'Published' : 'Unpublished'}
                          </label>
                        </div>
                        
                        <div className="flex justify-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/listing/${listing.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/edit-listing/${listing.id}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          
                          <div className="relative group">
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block">
                              <div className="py-1">
                                <button 
                                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  onClick={() => handleDelete(listing.id)}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete Listing
                                </button>
                                <button 
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleRenew(listing.id)}
                                >
                                  <RotateCw className="h-4 w-4 mr-2" />
                                  Renew Listing
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserListings;

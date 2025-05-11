import { useState, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { FiMail, FiPhone, FiSearch, FiPlusCircle, FiX } from "react-icons/fi";

const UserBrowser = () => {
  const mockUsers = [
    {
      id: 1,
      name: "John Anderson",
      email: "john.anderson@example.com",
      phone: "+1 (555) 123-4567",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      email: "sarah.mitchell@example.com",
      phone: "+1 (555) 234-5678",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "+1 (555) 345-6789",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      phone: "+1 (555) 456-7890",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    {
      id: 5,
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1 (555) 567-8901",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
      id: 6,
      name: "Lisa Thompson",
      email: "lisa.thompson@example.com",
      phone: "+1 (555) 678-9012",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
    },
    {
      id: 7,
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      phone: "+1 (555) 789-0123",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
    },
    {
      id: 8,
      name: "Jennifer Lee",
      email: "jennifer.lee@example.com",
      phone: "+1 (555) 890-1234",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    },
    {
      id: 9,
      name: "William Davis",
      email: "william.davis@example.com",
      phone: "+1 (555) 901-2345",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    },
    {
      id: 10,
      name: "Amanda Martinez",
      email: "amanda.martinez@example.com",
      phone: "+1 (555) 012-3456",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
    }
  ];

  // Added: New state for selected users
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useCallback(
    debounce((query) => setSearchQuery(query), 300),
    []
  );

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
    );
  }, [searchQuery]);

  // Added: Handler for adding users
  const handleAddUser = (user) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Added: Handler for removing users
  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  // Updated: UserCard component with Add button
  const UserCard = ({ user, isSelected = false, onAction }) => (
    <div
      className="flex-shrink-0 w-72 p-4 m-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      role="button"
      tabIndex={0}
      aria-label={`User card for ${user.name}`}
    >
      <div className="flex items-center space-x-4">
        <img
          src={user.image}
          alt={`${user.name}'s profile`}
          className="w-16 h-16 rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e";
          }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <FiMail className="mr-2" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <FiPhone className="mr-2" />
            <span>{user.phone}</span>
          </div>
        </div>
      </div>
      {/* Added: Action button */}
      <button
        onClick={() => onAction(user)}
        className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md ${isSelected ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-300`}
      >
        {isSelected ? (
          <><FiX className="mr-2" /> Remove</>
        ) : (
          <><FiPlusCircle className="mr-2" /> Add</>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => debouncedSearch(e.target.value)}
            aria-label="Search users"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            No users found matching your search criteria.
          </div>
        ) : (
          // Updated: Horizontal scrolling container
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4 w-max">
              {filteredUsers.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  isSelected={selectedUsers.some(u => u.id === user.id)}
                  onAction={handleAddUser}
                />
              ))}
            </div>
          </div>
        )}

        {/* Added: Selected Users Grid */}
        {selectedUsers.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Selected Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedUsers.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  isSelected={true}
                  onAction={handleRemoveUser}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBrowser;
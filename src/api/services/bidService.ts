
import { Bid } from '../models/types';
import { currentBids } from '../data/mockData';

// Local storage for bids - in a real app this would be a database
let bids = [...currentBids];

export const bidService = {
  getAllBids: async (): Promise<Bid[]> => {
    return Promise.resolve([...bids]);
  },
  
  getBidById: async (id: string): Promise<Bid | null> => {
    const bid = bids.find(b => b.id === id);
    return Promise.resolve(bid || null);
  },
  
  getBidsByEmployee: async (employeeId: string): Promise<Bid[]> => {
    const employeeBids = bids.filter(b => b.employeeId === employeeId);
    return Promise.resolve(employeeBids);
  },
  
  getBidsForShift: async (shiftId: string): Promise<Bid[]> => {
    const shiftBids = bids.filter(b => b.shiftId === shiftId);
    return Promise.resolve(shiftBids);
  },
  
  createBid: async (bid: Omit<Bid, 'id' | 'createdAt'>): Promise<Bid> => {
    const newBid: Bid = {
      ...bid,
      id: `bid-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    bids.push(newBid);
    return Promise.resolve(newBid);
  },
  
  updateBidStatus: async (id: string, status: 'Pending' | 'Approved' | 'Rejected' | 'Confirmed'): Promise<Bid | null> => {
    const index = bids.findIndex(b => b.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedBid = {
      ...bids[index],
      status
    };
    
    bids[index] = updatedBid;
    
    // If a shift is offered (approved), reject all other bids for this shift
    if (status === 'Approved') {
      const shiftId = updatedBid.shiftId;
      
      // Find all other pending bids for the same shift
      const otherBidsForShiftIndexes = bids.reduce((indexes, bid, idx) => {
        if (bid.shiftId === shiftId && bid.id !== id && bid.status === 'Pending') {
          indexes.push(idx);
        }
        return indexes;
      }, [] as number[]);
      
      // Reject all other pending bids
      otherBidsForShiftIndexes.forEach(idx => {
        bids[idx] = {
          ...bids[idx],
          status: 'Rejected',
          notes: 'Shift offered to another employee'
        };
      });
    }
    
    return Promise.resolve(updatedBid);
  },
  
  // New methods for bulk operations
  updateBulkBidStatus: async (ids: string[], status: 'Pending' | 'Approved' | 'Rejected' | 'Confirmed'): Promise<Bid[]> => {
    const updatedBids: Bid[] = [];
    
    ids.forEach(id => {
      const index = bids.findIndex(b => b.id === id);
      if (index !== -1) {
        const updatedBid = {
          ...bids[index],
          status
        };
        
        bids[index] = updatedBid;
        updatedBids.push(updatedBid);
      }
    });
    
    return Promise.resolve(updatedBids);
  },
  
  addNotesToBid: async (id: string, notes: string): Promise<Bid | null> => {
    const index = bids.findIndex(b => b.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedBid = {
      ...bids[index],
      notes
    };
    
    bids[index] = updatedBid;
    return Promise.resolve(updatedBid);
  },
  
  // New method to withdraw a bid
  withdrawBid: async (id: string): Promise<boolean> => {
    const index = bids.findIndex(b => b.id === id);
    if (index === -1) return Promise.resolve(false);
    
    bids.splice(index, 1);
    return Promise.resolve(true);
  }
};

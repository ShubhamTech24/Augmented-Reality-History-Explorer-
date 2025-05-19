import { users, type User, type InsertUser } from "@shared/schema";

// Import monument types
type Monument = {
  id: string;
  name: string;
  city: string;
  state: string;
  coordinates: [number, number];
  description: string;
  yearBuilt: string;
  dynasty: string;
  primaryModel: string;
  historicalModels: {
    past: string;
    ancient: string;
  };
  facts: string[];
  visitingHours: string;
  entryFee?: string;
  UNESCO?: boolean;
};

type MonumentVisit = {
  id: number;
  monumentId: string;
  userId?: number;
  visitDate: Date;
  lastAction: Date;
};

// Static monument data - simulating a database
const monumentsData: Monument[] = [
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    city: "Agra",
    state: "Uttar Pradesh",
    coordinates: [78.0421, 27.1751],
    description: "The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favourite wife, Mumtaz Mahal.",
    yearBuilt: "1632-1653",
    dynasty: "Mughal",
    primaryModel: "/models/taj_mahal_present.glb",
    historicalModels: {
      past: "/models/taj_mahal_1900.glb",
      ancient: "/models/taj_mahal_original.glb"
    },
    facts: [
      "The Taj Mahal was designated as a UNESCO World Heritage Site in 1983.",
      "It took approximately 20,000 artisans to complete the construction.",
      "The central dome reaches a height of 73 meters (240 feet).",
      "The edifice contains semi-precious stones sourced from all over Asia."
    ],
    visitingHours: "Sunrise to Sunset, closed on Fridays",
    entryFee: "₹1,100 for foreign tourists, ₹50 for Indian nationals",
    UNESCO: true
  },
  {
    id: "red-fort",
    name: "Red Fort",
    city: "Delhi",
    state: "Delhi",
    coordinates: [77.2410, 28.6562],
    description: "The Red Fort is a historic fort in the city of Delhi that served as the main residence of the Mughal Emperors. Built in 1639 by the fifth Mughal Emperor Shah Jahan, the fort represents the peak of Mughal architecture.",
    yearBuilt: "1639-1648",
    dynasty: "Mughal",
    primaryModel: "/models/red_fort_present.glb",
    historicalModels: {
      past: "/models/red_fort_1900.glb",
      ancient: "/models/red_fort_original.glb"
    },
    facts: [
      "The Red Fort was the ceremonial and political center of the Mughal government.",
      "It covers a total area of about 254.67 acres.",
      "The fort's massive walls are 33 meters (108 ft) high.",
      "It was designated a UNESCO World Heritage Site in 2007."
    ],
    visitingHours: "Tuesday to Sunday, 9:30 AM to 4:30 PM",
    entryFee: "₹600 for foreign tourists, ₹35 for Indian nationals",
    UNESCO: true
  },
  {
    id: "qutub-minar",
    name: "Qutub Minar",
    city: "Delhi",
    state: "Delhi",
    coordinates: [77.1855, 28.5245],
    description: "The Qutub Minar is a minaret and victory tower that forms part of the Qutub complex. It is a UNESCO World Heritage Site in the Mehrauli area of Delhi, India. The tower is 73 meters tall.",
    yearBuilt: "1192-1220",
    dynasty: "Mamluk",
    primaryModel: "/models/qutub_minar_present.glb",
    historicalModels: {
      past: "/models/qutub_minar_1900.glb",
      ancient: "/models/qutub_minar_original.glb"
    },
    facts: [
      "It's the tallest brick minaret in the world.",
      "The construction was started by Qutub-ud-din Aibak and completed by his successor Iltutmish.",
      "The tower has five distinct storeys, each marked by a projecting balcony.",
      "The first three storeys are made of red sandstone, while the fourth and fifth are of marble and sandstone."
    ],
    visitingHours: "Sunrise to Sunset, all days of the week",
    entryFee: "₹600 for foreign tourists, ₹30 for Indian nationals",
    UNESCO: true
  }
];

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllMonuments(): Promise<Monument[]>;
  getMonumentById(id: string): Promise<Monument | undefined>;
  recordMonumentVisit(monumentId: string): Promise<MonumentVisit>;
  getIndiaMapData(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private monuments: Monument[];
  private visits: MonumentVisit[];
  currentId: number;
  visitId: number;

  constructor() {
    this.users = new Map();
    this.monuments = monumentsData;
    this.visits = [];
    this.currentId = 1;
    this.visitId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllMonuments(): Promise<Monument[]> {
    return this.monuments;
  }
  
  async getMonumentById(id: string): Promise<Monument | undefined> {
    return this.monuments.find(monument => monument.id === id);
  }
  
  async recordMonumentVisit(monumentId: string): Promise<MonumentVisit> {
    const visit: MonumentVisit = {
      id: this.visitId++,
      monumentId: monumentId,
      visitDate: new Date(),
      lastAction: new Date()
    };
    
    this.visits.push(visit);
    return visit;
  }
  
  async getIndiaMapData(): Promise<any> {
    // In a real app, this would return GeoJSON data for India's map
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [68.7, 8.4],  // Bottom-left
                [97.25, 8.4], // Bottom-right
                [97.25, 37.6], // Top-right
                [68.7, 37.6],  // Top-left
                [68.7, 8.4]   // Close the polygon
              ]
            ]
          },
          properties: {
            name: "India"
          }
        }
      ]
    };
  }
}

export const storage = new MemStorage();

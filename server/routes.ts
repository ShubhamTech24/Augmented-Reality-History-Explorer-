import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the Historica application
  
  // Get all monuments
  app.get("/api/monuments", async (req, res) => {
    try {
      const monuments = await storage.getAllMonuments();
      res.json(monuments);
    } catch (error) {
      console.error("Error fetching monuments:", error);
      res.status(500).json({ message: "Error fetching monuments" });
    }
  });

  // Get a specific monument by ID
  app.get("/api/monuments/:id", async (req, res) => {
    try {
      const monument = await storage.getMonumentById(req.params.id);
      
      if (!monument) {
        return res.status(404).json({ message: "Monument not found" });
      }
      
      res.json(monument);
    } catch (error) {
      console.error(`Error fetching monument ${req.params.id}:`, error);
      res.status(500).json({ message: "Error fetching monument details" });
    }
  });

  // Record a monument visit
  app.post("/api/monuments/:id/visit", async (req, res) => {
    try {
      const result = await storage.recordMonumentVisit(req.params.id);
      res.json(result);
    } catch (error) {
      console.error(`Error recording visit for monument ${req.params.id}:`, error);
      res.status(500).json({ message: "Error recording monument visit" });
    }
  });

  // Get GeoJSON data for India map
  app.get("/api/map/india", async (req, res) => {
    try {
      const mapData = await storage.getIndiaMapData();
      res.json(mapData);
    } catch (error) {
      console.error("Error fetching India map data:", error);
      res.status(500).json({ message: "Error fetching map data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

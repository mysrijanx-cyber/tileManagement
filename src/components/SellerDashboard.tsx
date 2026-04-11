
// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Plus,
// // //   Edit,
// // //   Trash2,
// // //   Upload,
// // //   Save,
// // //   Store,
// // //   Package,
// // //   FileSpreadsheet,
// // //   AlertCircle,
// // //   CheckCircle,
// // //   Loader,
// // //   Search,
// // //   Filter,
// // //   Users,
// // //   RefreshCw,
// // //   ChevronUp,
// // //   ChevronDown,
// // //   Eye,
// // //   TrendingUp,
// // //   QrCode,
// // //   Download,
// // //   User,
// // //   Menu,
// // //   X,
// // //   ChevronLeft,
// // //   ChevronRight,
// // // } from "lucide-react";
// // // import { Tile } from "../types";
// // // import { useAppStore } from "../stores/appStore";
// // // import { BulkUpload } from "./BulkUpload";
// // // import { AnalyticsDashboard } from "./AnalyticsDashboard";
// // // import { QRCodeManager } from "./QRCodeManager";
// // // import { ExcelUpload } from "./ExcelUpload";
// // // import { generateTileQRCode } from "../utils/qrCodeUtils";
// // // import { SellerProfile } from "./SellerProfile";
// // // import { WorkerManagement } from "./WorkerManagement";
// // // import { SellerStockAnalytics } from "./SellerStockAnalytics";
// // // import { CustomerInquiriesManager } from './CustomerInquiriesManager';

// // // import {
// // //   uploadTile,
// // //   updateTile,
// // //   deleteTile,
// // //   getSellerProfile,
// // //   getSellerTiles,
// // //   updateTileQRCode,
// // //   getTileById,
// // // } from "../lib/firebaseutils";

// // // import { uploadToCloudinary } from "../utils/cloudinaryUtils";

// // // export const SellerDashboard: React.FC = () => {
// // //   const { currentUser, isAuthenticated } = useAppStore();
// // //   const [isAddingTile, setIsAddingTile] = useState(false);
// // //   const [activeTab, setActiveTab] = useState<
// // //     | "tiles"
// // //     | "bulk"
// // //     | "excel"
// // //     | "analytics"
// // //     | "qrcodes"
// // //     | "profile"
// // //     | "worker"
// // //     | "scan"
// // //     | "stock-analytics"
// // //     | "customer-inquiries"
// // //   >("tiles");

// // //   const [editingTile, setEditingTile] = useState<Tile | null>(null);
// // //   const [sellerProfile, setSellerProfile] = useState<any>(null);
// // //   const [tiles, setTiles] = useState<Tile[]>([]);
// // //   const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [imageUploading, setImageUploading] = useState(false);
// // //   const [textureUploading, setTextureUploading] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [success, setSuccess] = useState<string | null>(null);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [categoryFilter, setCategoryFilter] = useState<string>("all");
// // //   const [stockFilter, setStockFilter] = useState<string>("all");
// // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// // //   const [expandedTileId, setExpandedTileId] = useState<string | null>(null);

// // //   // ✅ PAGINATION STATE
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [itemsPerPage] = useState(10); // Fixed at 10 items per page

// // //   const [newTile, setNewTile] = useState<Partial<Tile>>({
// // //     name: "",
// // //     category: "both",
// // //     size: "",
// // //     price: undefined,
// // //     stock: 0,
// // //     inStock: true,
// // //     imageUrl: "",
// // //     textureUrl: "",
// // //     tileCode: "",
// // //     tileSurface: "",
// // //     tileMaterial: "",
// // //   });

// // //   useEffect(() => {
// // //     console.log("🔍 SellerDashboard Auth Check:", {
// // //       currentUser: currentUser?.email || "null",
// // //       isAuthenticated,
// // //       userRole: currentUser?.role || "null",
// // //     });

// // //     if (currentUser && isAuthenticated) {
// // //       loadData();
// // //     } else if (currentUser === null && !isAuthenticated) {
// // //       setLoading(false);
// // //     }
// // //   }, [currentUser, isAuthenticated]);

// // //   // ✅ RESET TO PAGE 1 WHEN FILTERS CHANGE
// // //   useEffect(() => {
// // //     filterTiles();
// // //     setCurrentPage(1);
// // //   }, [tiles, searchTerm, categoryFilter, stockFilter]);

// // //   useEffect(() => {
// // //     if (error || success) {
// // //       const timer = setTimeout(() => {
// // //         setError(null);
// // //         setSuccess(null);
// // //       }, 5000);
// // //       return () => clearTimeout(timer);
// // //     }
// // //   }, [error, success]);

// // //   const loadData = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       console.log("🔄 Loading seller data for:", currentUser?.email);

// // //       const [profile, sellerTiles] = await Promise.all([
// // //         getSellerProfile(currentUser?.user_id || ""),
// // //         getSellerTiles(currentUser?.user_id || ""),
// // //       ]);

// // //       setSellerProfile(profile);

// // //       if (sellerTiles && sellerTiles.length > 0) {
// // //         const uniqueTilesMap = new Map();
// // //         sellerTiles.forEach((tile) => {
// // //           if (tile.id && !uniqueTilesMap.has(tile.id)) {
// // //             uniqueTilesMap.set(tile.id, tile);
// // //           }
// // //         });

// // //         const uniqueTiles = Array.from(uniqueTilesMap.values());

// // //         console.log("✅ Seller data loaded:", {
// // //           profile: profile?.business_name || "No profile",
// // //           tilesRaw: sellerTiles.length,
// // //           tilesUnique: uniqueTiles.length,
// // //         });

// // //         setTiles(uniqueTiles);
// // //       } else {
// // //         setTiles([]);
// // //         console.log("ℹ️ No tiles found");
// // //       }
// // //     } catch (error: any) {
// // //       console.error("❌ Error loading seller data:", error);
// // //       setError("Failed to load dashboard data. Please refresh the page.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const filterTiles = () => {
// // //     let filtered = tiles;

// // //     if (searchTerm) {
// // //       filtered = filtered.filter(
// // //         (tile) =>
// // //           tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //           tile.tileCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //           tile.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //           tile.tileSurface?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //           tile.tileMaterial?.toLowerCase().includes(searchTerm.toLowerCase())
// // //       );
// // //     }

// // //     if (categoryFilter !== "all") {
// // //       filtered = filtered.filter((tile) => tile.category === categoryFilter);
// // //     }

// // //     if (stockFilter === "in-stock") {
// // //       filtered = filtered.filter((tile) => tile.inStock);
// // //     } else if (stockFilter === "out-of-stock") {
// // //       filtered = filtered.filter((tile) => !tile.inStock);
// // //     }

// // //     setFilteredTiles(filtered);
// // //   };

// // //   // ✅ PAGINATION CALCULATIONS
// // //   const totalPages = Math.ceil(filteredTiles.length / itemsPerPage);
// // //   const indexOfLastItem = currentPage * itemsPerPage;
// // //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// // //   const currentTiles = filteredTiles.slice(indexOfFirstItem, indexOfLastItem);

// // //   // ✅ PAGINATION HANDLERS
// // //   const goToPage = (pageNumber: number) => {
// // //     setCurrentPage(pageNumber);
// // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // //   };

// // //   const goToNextPage = () => {
// // //     if (currentPage < totalPages) {
// // //       setCurrentPage(currentPage + 1);
// // //       window.scrollTo({ top: 0, behavior: 'smooth' });
// // //     }
// // //   };

// // //   const goToPreviousPage = () => {
// // //     if (currentPage > 1) {
// // //       setCurrentPage(currentPage - 1);
// // //       window.scrollTo({ top: 0, behavior: 'smooth' });
// // //     }
// // //   };

// // //   // ✅ GENERATE PAGE NUMBERS FOR PAGINATION
// // //   const getPageNumbers = () => {
// // //     const pages = [];
// // //     const maxPagesToShow = 5;

// // //     if (totalPages <= maxPagesToShow) {
// // //       for (let i = 1; i <= totalPages; i++) {
// // //         pages.push(i);
// // //       }
// // //     } else {
// // //       if (currentPage <= 3) {
// // //         for (let i = 1; i <= 4; i++) pages.push(i);
// // //         pages.push('...');
// // //         pages.push(totalPages);
// // //       } else if (currentPage >= totalPages - 2) {
// // //         pages.push(1);
// // //         pages.push('...');
// // //         for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
// // //       } else {
// // //         pages.push(1);
// // //         pages.push('...');
// // //         for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
// // //         pages.push('...');
// // //         pages.push(totalPages);
// // //       }
// // //     }

// // //     return pages;
// // //   };

// // //   const generateTileCode = (): string => {
// // //     const prefix =
// // //       sellerProfile?.business_name?.substring(0, 3).toUpperCase() || "TIL";
// // //     const timestamp = Date.now().toString().slice(-6);
// // //     const random = Math.random().toString(36).substring(2, 4).toUpperCase();
// // //     return `${prefix}${timestamp}${random}`;
// // //   };

// // //   const handleImageUpload = async (file: File, type: "image" | "texture") => {
// // //     try {
// // //       if (type === "image") {
// // //         setImageUploading(true);
// // //       } else {
// // //         setTextureUploading(true);
// // //       }

// // //       if (!file.type.startsWith("image/")) {
// // //         throw new Error("Please select a valid image file");
// // //       }

// // //       if (file.size > 5 * 1024 * 1024) {
// // //         throw new Error("Image size should be less than 5MB");
// // //       }

// // //       console.log(`🔄 Uploading ${type}:`, file.name);
// // //       const imageUrl = await uploadToCloudinary(
// // //         file,
// // //         type === "image" ? "tiles/main" : "tiles/textures"
// // //       );

// // //       if (type === "image") {
// // //         setNewTile((prev) => ({ ...prev, imageUrl }));
// // //       } else {
// // //         setNewTile((prev) => ({ ...prev, textureUrl: imageUrl }));
// // //       }

// // //       setSuccess(
// // //         `${type === "image" ? "Image" : "Texture"} uploaded successfully`
// // //       );
// // //       console.log(`✅ ${type} uploaded:`, imageUrl);
// // //     } catch (error: any) {
// // //       console.error(`❌ ${type} upload failed:`, error);
// // //       setError(error.message || `Failed to upload ${type}`);
// // //     } finally {
// // //       if (type === "image") {
// // //         setImageUploading(false);
// // //       } else {
// // //         setTextureUploading(false);
// // //       }
// // //     }
// // //   };

// // //   const validateTileForm = (): string | null => {
// // //     if (!newTile.name?.trim()) {
// // //       return "❌ Tile Name is required. Please enter a tile name.";
// // //     }

// // //     if (!newTile.size?.trim()) {
// // //       return "❌ Tile Size is required. Please enter or select a size (e.g., 60x60 cm).";
// // //     }

// // //     if (!newTile.price || newTile.price <= 0) {
// // //       return "❌ Valid Price is required. Please enter a price greater than 0.";
// // //     }

// // //     if (newTile.stock === undefined || newTile.stock < 0) {
// // //       return "❌ Valid Stock Quantity is required. Please enter stock (0 or more).";
// // //     }

// // //     if (!newTile.imageUrl?.trim()) {
// // //       return "❌ Tile Image is required. Please upload an image before saving.";
// // //     }

// // //     return null;
// // //   };

// // //   const handleAddTile = async () => {
// // //     try {
// // //       setError(null);

// // //       const validationError = validateTileForm();
// // //       if (validationError) {
// // //         setError(validationError);
// // //         window.scrollTo({ top: 0, behavior: "smooth" });
// // //         setTimeout(() => {
// // //           setError((prev) => (prev === validationError ? null : prev));
// // //         }, 8000);
// // //         return;
// // //       }

// // //       if (!currentUser) {
// // //         setError("User not authenticated");
// // //         window.scrollTo({ top: 0, behavior: "smooth" });
// // //         return;
// // //       }

// // //       console.log("🔄 Step 1/4: Preparing tile data...");

// // //       const tileCode = newTile.tileCode || generateTileCode();

// // //       const baseTileData = {
// // //         ...newTile,
// // //         sellerId: currentUser.user_id,
// // //         showroomId: currentUser.user_id,
// // //         tileCode: tileCode,
// // //         inStock: (newTile.stock || 0) > 0,
// // //         createdAt: new Date().toISOString(),
// // //         updatedAt: new Date().toISOString(),
// // //       };

// // //       console.log("💾 Step 2/4: Saving tile to database...");

// // //       const savedTile = await uploadTile(baseTileData);

// // //       if (!savedTile || !savedTile.id) {
// // //         throw new Error("Tile saved but ID not returned");
// // //       }

// // //       console.log("✅ Tile saved with ID:", savedTile.id);
// // //       console.log("📱 Step 3/4: Generating QR code...");

// // //       let qrCodeGenerated = false;
// // //       try {
// // //         const qrCodeDataUrl = await generateTileQRCode(savedTile);
// // //         console.log("✅ QR code generated successfully");
// // //         console.log("🔄 Step 4/4: Updating tile with QR code...");
// // //         await updateTileQRCode(savedTile.id, qrCodeDataUrl);
// // //         console.log("✅ Tile updated with QR code");
// // //         qrCodeGenerated = true;
// // //       } catch (qrError: any) {
// // //         console.warn("⚠️ QR code generation failed:", qrError.message);
// // //       }

// // //       await loadData();

// // //       setIsAddingTile(false);
// // //       resetNewTile();

// // //       if (qrCodeGenerated) {
// // //         setSuccess("✅ Tile added successfully with QR code!");
// // //       } else {
// // //         setSuccess("✅ Tile added! QR code can be generated from QR Codes tab.");
// // //       }

// // //       console.log("🎉 Tile creation completed!");
// // //     } catch (error: any) {
// // //       console.error("❌ Tile creation failed:", error);
// // //       setError(`Failed to add tile: ${error.message}`);
// // //     }
// // //   };

// // //   const handleEditTile = async (tile: Tile) => {
// // //     console.log("🔄 Editing tile:", tile.name);
// // //     setEditingTile(tile);
// // //     setNewTile({
// // //       ...tile,
// // //       stock: tile.stock || 0,
// // //     });
// // //     setIsAddingTile(false);
// // //     setError(null);
// // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // //   };

// // //   const handleUpdateTile = async () => {
// // //     try {
// // //       setError(null);

// // //       const validationError = validateTileForm();
// // //       if (validationError) {
// // //         setError(validationError);
// // //         return;
// // //       }

// // //       if (!editingTile) {
// // //         setError("No tile selected for editing");
// // //         return;
// // //       }

// // //       console.log("🔄 Starting tile update:", editingTile.name);

// // //       const updates = {
// // //         ...newTile,
// // //         inStock: (newTile.stock || 0) > 0,
// // //         updatedAt: new Date().toISOString(),
// // //       };

// // //       console.log("💾 Updating tile in database...");
// // //       await updateTile(editingTile.id, updates);
// // //       console.log("✅ Tile updated in database");

// // //       const criticalFieldsChanged =
// // //         editingTile.name !== newTile.name ||
// // //         editingTile.tileCode !== newTile.tileCode ||
// // //         editingTile.price !== newTile.price ||
// // //         editingTile.size !== newTile.size ||
// // //         editingTile.category !== newTile.category;

// // //       if (criticalFieldsChanged) {
// // //         console.log("🔄 Critical fields changed, attempting QR regeneration...");

// // //         setTimeout(async () => {
// // //           try {
// // //             if (typeof getTileById !== "function") {
// // //               console.warn("⚠️ getTileById not available, skipping QR regeneration");
// // //               return;
// // //             }

// // //             if (typeof generateTileQRCode !== "function") {
// // //               console.warn("⚠️ generateTileQRCode not available, skipping QR regeneration");
// // //               return;
// // //             }

// // //             if (typeof updateTileQRCode !== "function") {
// // //               console.warn("⚠️ updateTileQRCode not available, skipping QR regeneration");
// // //               return;
// // //             }

// // //             console.log("📱 Fetching updated tile data...");
// // //             const updatedTileData = await getTileById(editingTile.id);

// // //             if (!updatedTileData) {
// // //               console.warn("⚠️ Could not fetch updated tile, skipping QR regeneration");
// // //               return;
// // //             }

// // //             console.log("📱 Generating new QR code...");
// // //             const newQRCode = await generateTileQRCode(updatedTileData);

// // //             if (!newQRCode || !newQRCode.startsWith("data:image")) {
// // //               console.warn("⚠️ Invalid QR code generated, skipping update");
// // //               return;
// // //             }

// // //             console.log("💾 Updating QR code in database...");
// // //             await updateTileQRCode(editingTile.id, newQRCode);

// // //             console.log("✅ QR code regenerated successfully");

// // //             await loadData();
// // //           } catch (qrError: any) {
// // //             console.error("⚠️ QR regeneration failed (non-critical):", qrError.message);
// // //           }
// // //         }, 0);
// // //       } else {
// // //         console.log("ℹ️ No critical fields changed, keeping existing QR code");
// // //       }

// // //       console.log("🔄 Reloading tiles list...");
// // //       await loadData();

// // //       setEditingTile(null);
// // //       resetNewTile();

// // //       setSuccess("Tile updated successfully!");
// // //       console.log("✅ Tile update complete");
// // //     } catch (error: any) {
// // //       console.error("❌ Error updating tile:", error);
// // //       setError(`Failed to update tile: ${error.message}`);
// // //     }
// // //   };

// // //   const handleDeleteTile = async (tileId: string, tileName: string) => {
// // //     if (!window.confirm(`Delete "${tileName}"?`)) return;

// // //     try {
// // //       setError(null);
// // //       console.log("🔥 Deleting:", tileId);

// // //       await deleteTile(tileId);

// // //       console.log("✅ Deleted from database");

// // //       await loadData();

// // //       setSuccess("Tile deleted successfully");
// // //     } catch (error: any) {
// // //       console.error("❌ Delete failed:", error);
// // //       setError(`Delete failed: ${error.message}`);
// // //     }
// // //   };

// // //   const resetNewTile = () => {
// // //     setNewTile({
// // //       name: "",
// // //       category: "both",
// // //       size: "",
// // //       price: 0,
// // //       stock: 0,
// // //       inStock: true,
// // //       imageUrl: "",
// // //       textureUrl: "",
// // //       tileCode: "",
// // //       tileSurface: "",
// // //       tileMaterial: "",
// // //     });
// // //   };

// // //   const handleTabChange = (tab: typeof activeTab) => {
// // //     setActiveTab(tab);
// // //     setError(null);
// // //     setSuccess(null);
// // //     setMobileMenuOpen(false);
// // //     console.log("🎯 Switched to tab:", tab);
// // //   };

// // //   const getStockStatusColor = (tile: Tile) => {
// // //     if (!tile.inStock) return "bg-red-100 text-red-800";
// // //     if ((tile.stock || 0) < 10) return "bg-yellow-100 text-yellow-800";
// // //     return "bg-green-100 text-green-800";
// // //   };

// // //   const getStockStatusText = (tile: Tile) => {
// // //     if (!tile.inStock) return "Out of Stock";
// // //     if ((tile.stock || 0) < 10) return "Low Stock";
// // //     return "In Stock";
// // //   };

// // //   if (!isAuthenticated) {
// // //     return (
// // //       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
// // //         <div className="text-center py-8 sm:py-12">
// // //           <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
// // //           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
// // //             Authentication Required
// // //           </h2>
// // //           <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
// // //             Please log in to access the seller dashboard.
// // //           </p>
// // //           <button
// // //             onClick={() => window.location.reload()}
// // //             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
// // //           >
// // //             Refresh Page
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!currentUser) {
// // //     return (
// // //       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
// // //         <div className="text-center py-8 sm:py-12">
// // //           <User className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
// // //           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
// // //             User Profile Not Found
// // //           </h2>
// // //           <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
// // //             Unable to load user profile. Please try logging in again.
// // //           </p>
// // //           <button
// // //             onClick={() => window.location.reload()}
// // //             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
// // //           >
// // //             Reload Dashboard
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (currentUser.role !== "seller") {
// // //     return (
// // //       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
// // //         <div className="text-center py-8 sm:py-12">
// // //           <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-4" />
// // //           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
// // //             Access Denied
// // //           </h2>
// // //           <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
// // //             This dashboard is only accessible to sellers. Your role:{" "}
// // //             <strong>{currentUser.role}</strong>
// // //           </p>
// // //           <button
// // //             onClick={() => (window.location.href = "/")}
// // //             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
// // //           >
// // //             Go to Home
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
// // //         <div className="flex items-center justify-center h-64">
// // //           <div className="text-center">
// // //             <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-green-600 mx-auto mb-4" />
// // //             <p className="text-gray-600 text-base sm:text-lg">
// // //               Loading dashboard...
// // //             </p>
// // //             <p className="text-gray-500 text-xs sm:text-sm mt-2 px-4">
// // //               Loading data for {currentUser.full_name || currentUser.email}
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
// // //       {/* Header */}
// // //       <div className="flex flex-col gap-4 mb-4 sm:mb-6">
// // //         {/* Title Section */}
// // //         <div className="flex items-start justify-between gap-3">
// // //           <div className="flex items-center gap-2 sm:gap-3 min-w-0">
// // //             <Store className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
// // //             <div className="min-w-0">
// // //               <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
// // //                 Seller Dashboard
// // //               </h2>
// // //               <p className="text-xs sm:text-sm text-gray-600 truncate">
// // //                 {sellerProfile?.business_name || "Your Business"}
// // //               </p>

// // //               {/* Stats - Mobile Optimized */}
// // //               <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500">
// // //                 <span className="flex items-center gap-1 whitespace-nowrap">
// // //                   <Package className="w-3 h-3 sm:w-4 sm:h-4" />
// // //                   {tiles.length} Total
// // //                 </span>
// // //                 <span className="flex items-center gap-1 text-green-600 whitespace-nowrap">
// // //                   <Package className="w-3 h-3 sm:w-4 sm:h-4" />
// // //                   {tiles.filter((t) => t.inStock).length} Stock
// // //                 </span>
// // //                 <span className="flex items-center gap-1 text-red-600 whitespace-nowrap">
// // //                   <Package className="w-3 h-3 sm:w-4 sm:h-4" />
// // //                   {tiles.filter((t) => !t.inStock).length} Out
// // //                 </span>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Mobile Menu Toggle */}
// // //           <button
// // //             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // //             className="lg:hidden flex-shrink-0 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
// // //           >
// // //             {mobileMenuOpen ? (
// // //               <X className="w-6 h-6" />
// // //             ) : (
// // //               <Menu className="w-6 h-6" />
// // //             )}
// // //           </button>
// // //         </div>

// // //         {/* Navigation Tabs - Desktop */}
// // //         <div className="hidden lg:flex gap-2 flex-wrap">
// // //           <button
// // //             onClick={() => handleTabChange("tiles")}
// // //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //               activeTab === "tiles"
// // //                 ? "bg-green-600 text-white"
// // //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// // //             }`}
// // //           >
// // //             <Edit className="w-4 h-4" />
// // //             My Tiles
// // //           </button>
// // //           <button
// // //             onClick={() => handleTabChange("worker")}
// // //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //               activeTab === "worker"
// // //                 ? "bg-green-600 text-white"
// // //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// // //             }`}
// // //           >
// // //             <User className="w-4 h-4" />
// // //             Worker
// // //           </button>
// // //           <button
// // //             onClick={() => handleTabChange("customer-inquiries")}
// // //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //               activeTab === "customer-inquiries"
// // //                 ? "bg-green-600 text-white"
// // //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// // //             }`}
// // //           >
// // //             <Users className="w-4 h-4" />
// // //             Customers
// // //           </button>
// // //           <button
// // //             onClick={() => window.open("/scan", "_blank")}
// // //             className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700 text-sm"
// // //           >
// // //             <QrCode className="w-4 h-4" />
// // //             Scan
// // //           </button>
// // //           <button
// // //             onClick={() => handleTabChange("profile")}
// // //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //               activeTab === "profile"
// // //                 ? "bg-green-600 text-white"
// // //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// // //             }`}
// // //           >
// // //             <User className="w-4 h-4" />
// // //             Profile
// // //           </button>
// // //           <button
// // //             onClick={() => handleTabChange("excel")}
// // //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //               activeTab === "excel"
// // //                 ? "bg-green-600 text-white"
// // //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// // //             }`}
// // //           >
// // //             <FileSpreadsheet className="w-4 h-4" />
// // //             Excel
// // //           </button>
// // //           <button
// // //             onClick={() => handleTabChange("stock-analytics")}
// // //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //               activeTab === "stock-analytics"
// // //                 ? "bg-green-600 text-white"
// // //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// // //             }`}
// // //           >
// // //             <Package className="w-4 h-4" />
// // //             Stock Analytics
// // //           </button>
// // //           <button
// // //             onClick={() => handleTabChange("bulk")}
// // //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //               activeTab === "bulk"
// // //                 ? "bg-green-600 text-white"
// // //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// // //             }`}
// // //           >
// // //             <Upload className="w-4 h-4" />
// // //             CSV
// // //           </button>
// // //           <button
// // //             onClick={() => handleTabChange("qrcodes")}
// // //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //               activeTab === "qrcodes"
// // //                 ? "bg-green-600 text-white"
// // //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// // //             }`}
// // //           >
// // //             <QrCode className="w-4 h-4" />
// // //             QR Codes
// // //           </button>
// // //         </div>

// // //         {/* Navigation Tabs - Mobile Dropdown */}
// // //         {mobileMenuOpen && (
// // //           <div className="lg:hidden grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
// // //             <button
// // //               onClick={() => handleTabChange("tiles")}
// // //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //                 activeTab === "tiles"
// // //                   ? "bg-green-600 text-white"
// // //                   : "bg-white text-gray-700 hover:bg-gray-100"
// // //               }`}
// // //             >
// // //               <Edit className="w-4 h-4" />
// // //               Tiles
// // //             </button>
// // //             <button
// // //               onClick={() => handleTabChange("customer-inquiries")}
// // //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //                 activeTab === "customer-inquiries"
// // //                   ? "bg-green-600 text-white"
// // //                   : "bg-white text-gray-700 hover:bg-gray-100"
// // //               }`}
// // //             >
// // //               <Users className="w-4 h-4" />
// // //               Customers
// // //             </button>
// // //             <button
// // //               onClick={() => handleTabChange("worker")}
// // //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //                 activeTab === "worker"
// // //                   ? "bg-green-600 text-white"
// // //                   : "bg-white text-gray-700 hover:bg-gray-100"
// // //               }`}
// // //             >
// // //               <User className="w-4 h-4" />
// // //               Worker
// // //             </button>
// // //             <button
// // //               onClick={() => window.open("/scan", "_blank")}
// // //               className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700 text-sm"
// // //             >
// // //               <QrCode className="w-4 h-4" />
// // //               Scan
// // //             </button>
// // //             <button
// // //               onClick={() => handleTabChange("profile")}
// // //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //                 activeTab === "profile"
// // //                   ? "bg-green-600 text-white"
// // //                   : "bg-white text-gray-700 hover:bg-gray-100"
// // //               }`}
// // //             >
// // //               <User className="w-4 h-4" />
// // //               Profile
// // //             </button>
// // //             <button
// // //               onClick={() => handleTabChange("excel")}
// // //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //                 activeTab === "excel"
// // //                   ? "bg-green-600 text-white"
// // //                   : "bg-white text-gray-700 hover:bg-gray-100"
// // //               }`}
// // //             >
// // //               <FileSpreadsheet className="w-4 h-4" />
// // //               Excel
// // //             </button>
// // //             <button
// // //               onClick={() => handleTabChange("stock-analytics")}
// // //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //                 activeTab === "stock-analytics"
// // //                   ? "bg-green-600 text-white"
// // //                   : "bg-white text-gray-700 hover:bg-gray-100"
// // //               }`}
// // //             >
// // //               <Package className="w-4 h-4" />
// // //               Stock
// // //             </button>
// // //             <button
// // //               onClick={() => handleTabChange("bulk")}
// // //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //                 activeTab === "bulk"
// // //                   ? "bg-green-600 text-white"
// // //                   : "bg-white text-gray-700 hover:bg-gray-100"
// // //               }`}
// // //             >
// // //               <Upload className="w-4 h-4" />
// // //               CSV
// // //             </button>
// // //             <button
// // //               onClick={() => handleTabChange("qrcodes")}
// // //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
// // //                 activeTab === "qrcodes"
// // //                   ? "bg-green-600 text-white"
// // //                   : "bg-white text-gray-700 hover:bg-gray-100"
// // //               }`}
// // //             >
// // //               <QrCode className="w-4 h-4" />
// // //               QR
// // //             </button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Alert Messages */}
// // //       {error && (
// // //         <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
// // //           <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
// // //           <div className="flex-1 min-w-0">
// // //             <p className="text-red-800 font-medium text-sm sm:text-base">
// // //               Error
// // //             </p>
// // //             <p className="text-red-700 text-xs sm:text-sm break-words">
// // //               {error}
// // //             </p>
// // //           </div>
// // //           <button
// // //             onClick={() => setError(null)}
// // //             className="text-red-400 hover:text-red-600 font-bold text-lg flex-shrink-0"
// // //           >
// // //             ×
// // //           </button>
// // //         </div>
// // //       )}

// // //       {success && (
// // //         <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3">
// // //           <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
// // //           <div className="flex-1 min-w-0">
// // //             <p className="text-green-800 font-medium text-sm sm:text-base">
// // //               Success
// // //             </p>
// // //             <p className="text-green-700 text-xs sm:text-sm break-words">
// // //               {success}
// // //             </p>
// // //           </div>
// // //           <button
// // //             onClick={() => setSuccess(null)}
// // //             className="text-green-400 hover:text-green-600 font-bold text-lg flex-shrink-0"
// // //           >
// // //             ×
// // //           </button>
// // //         </div>
// // //       )}

// // //       {/* Tiles Tab */}
// // //       {activeTab === "tiles" && (
// // //         <>
// // //           {/* Controls - Responsive */}
// // //           <div className="flex flex-col gap-3 mb-4 sm:mb-6">
// // //             {/* Search Bar */}
// // //             <div className="relative">
// // //               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // //               <input
// // //                 type="text"
// // //                 placeholder="Search tiles by name, code, size, surface, material..."
// // //                 value={searchTerm}
// // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full text-sm sm:text-base"
// // //               />
// // //             </div>

// // //             {/* Filters Row */}
// // //             <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2">
// // //               <select
// // //                 value={categoryFilter}
// // //                 onChange={(e) => setCategoryFilter(e.target.value)}
// // //                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
// // //               >
// // //                 <option value="all">All Categories</option>
// // //                 <option value="floor">Floor Only</option>
// // //                 <option value="wall">Wall Only</option>
// // //                 <option value="both">Floor & Wall</option>
// // //               </select>

// // //               <select
// // //                 value={stockFilter}
// // //                 onChange={(e) => setStockFilter(e.target.value)}
// // //                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
// // //               >
// // //                 <option value="all">All Stock</option>
// // //                 <option value="in-stock">In Stock</option>
// // //                 <option value="out-of-stock">Out of Stock</option>
// // //               </select>

// // //               <button
// // //                 onClick={loadData}
// // //                 className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
// // //                 title="Refresh Data"
// // //               >
// // //                 <RefreshCw className="w-4 h-4" />
// // //                 <span className="hidden sm:inline">Refresh</span>
// // //               </button>

// // //               <button
// // //                 onClick={() => {
// // //                   setIsAddingTile(true);
// // //                   setEditingTile(null);
// // //                   resetNewTile();
// // //                   window.scrollTo({ top: 0, behavior: 'smooth' });
// // //                 }}
// // //                 className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
// // //               >
// // //                 <Plus className="w-4 h-4" />
// // //                 Add New Tile
// // //               </button>
// // //             </div>

// // //             {/* Results Summary with Pagination Info */}
// // //             <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center justify-between gap-2">
// // //               <div>
// // //                 Showing {currentTiles.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
// // //                 {searchTerm && (
// // //                   <span className="font-medium"> matching "{searchTerm}"</span>
// // //                 )}
// // //               </div>
// // //               {totalPages > 1 && (
// // //                 <div className="text-gray-500">
// // //                   Page {currentPage} of {totalPages}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>

// // //           {/* Add/Edit Tile Form - Responsive */}
// // //           {(isAddingTile || editingTile) && (
// // //             <div className="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6 border-2 border-dashed border-green-300 rounded-xl bg-green-50">
// // //               <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
// // //                 {editingTile ? (
// // //                   <>
// // //                     <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
// // //                     <span className="truncate">Edit: {editingTile.name}</span>
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
// // //                     Add New Tile
// // //                   </>
// // //                 )}
// // //               </h3>

// // //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
// // //                 {/* Tile Name */}
// // //                 <div className="space-y-2">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// // //                     Tile Name *
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     placeholder="Enter tile name"
// // //                     value={newTile.name}
// // //                     onChange={(e) =>
// // //                       setNewTile({ ...newTile, name: e.target.value })
// // //                     }
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
// // //                   />
// // //                 </div>

// // //                 {/* Tile Code */}
// // //                 <div className="space-y-2">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// // //                     Tile Code
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     placeholder="Auto-generated if empty"
// // //                     value={newTile.tileCode}
// // //                     onChange={(e) =>
// // //                       setNewTile({ ...newTile, tileCode: e.target.value })
// // //                     }
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
// // //                   />
// // //                 </div>

// // //                 {/* Category */}
// // //                 <div className="space-y-2">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// // //                     Category *
// // //                   </label>
// // //                   <select
// // //                     value={newTile.category}
// // //                     onChange={(e) =>
// // //                       setNewTile({
// // //                         ...newTile,
// // //                         category: e.target.value as any,
// // //                       })
// // //                     }
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
// // //                   >
// // //                     <option value="floor">Floor Only</option>
// // //                     <option value="wall">Wall Only</option>
// // //                     <option value="both">Floor & Wall</option>
// // //                   </select>
// // //                 </div>

// // //                 {/* Size */}
// // //                 <div className="space-y-2">
// // //                   <label
// // //                     htmlFor="tile-size-select"
// // //                     className="block text-xs sm:text-sm font-medium text-gray-700"
// // //                   >
// // //                     Size *
// // //                   </label>
// // //                   <div className="relative">
// // //                     <select
// // //                       id="tile-size-select"
// // //                       name="size"
// // //                       value={newTile.size}
// // //                       onChange={(e) => {
// // //                         console.log("Size selected:", e.target.value);
// // //                         setNewTile({ ...newTile, size: e.target.value });
// // //                       }}
// // //                       onFocus={(e) => {
// // //                         e.target.click();
// // //                       }}
// // //                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
// // //                       style={{
// // //                         WebkitAppearance: "none",
// // //                         MozAppearance: "none",
// // //                         touchAction: "manipulation",
// // //                       }}
// // //                     >
// // //                       <option value="">Select Tile Size</option>
// // //                       <option value="30x30 cm">30x30 cm</option>
// // //                       <option value="30x60 cm">30x60 cm</option>
// // //                       <option value="60x60 cm">60x60 cm</option>
// // //                       <option value="60x120 cm">60x120 cm</option>
// // //                       <option value="80x80 cm">80x80 cm</option>
// // //                       <option value="40x40 cm">40x40 cm</option>
// // //                       <option value="40x60 cm">40x60 cm</option>
// // //                       <option value="50x50 cm">50x50 cm</option>
// // //                       <option value="20x120 cm">20x120 cm</option>
// // //                       <option value="15x90 cm">15x90 cm</option>
// // //                       <option value="10x30 cm">10x30 cm</option>
// // //                       <option value="20x20 cm">20x20 cm</option>
// // //                       <option value="25x40 cm">25x40 cm</option>
// // //                       <option value="61x122 cm">61x122 cm</option>
// // //                       <option value="122x122 cm">122x122 cm</option>
// // //                       <option value="75x75 cm">75x75 cm</option>
// // //                       <option value="100x100 cm">100x100 cm</option>
// // //                       <option value="45x45 cm">45x45 cm</option>
// // //                       <option value="7.5x15 cm">7.5x15 cm</option>
// // //                       <option value="6x25 cm">6x25 cm</option>
// // //                     </select>

// // //                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
// // //                       <ChevronDown className="w-4 h-4 text-gray-400" />
// // //                     </div>
// // //                   </div>

// // //                   {newTile.size && (
// // //                     <div className="flex items-center gap-2 text-xs text-green-600">
// // //                       <CheckCircle className="w-3 h-3" />
// // //                       <span>Selected: {newTile.size}</span>
// // //                     </div>
// // //                   )}
// // //                 </div>

// // //                 {/* Tile Surface */}
// // //                 <div className="space-y-2">
// // //                   <label
// // //                     htmlFor="tile-surface-select"
// // //                     className="block text-xs sm:text-sm font-medium text-gray-700"
// // //                   >
// // //                     Tile Surface
// // //                   </label>
// // //                   <div className="relative">
// // //                     <select
// // //                       id="tile-surface-select"
// // //                       name="tileSurface"
// // //                       value={newTile.tileSurface || ""}
// // //                       onChange={(e) => {
// // //                         console.log("Surface selected:", e.target.value);
// // //                         setNewTile({
// // //                           ...newTile,
// // //                           tileSurface: e.target.value || undefined,
// // //                         });
// // //                       }}
// // //                       onFocus={(e) => {
// // //                         e.target.click();
// // //                       }}
// // //                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
// // //                       style={{
// // //                         WebkitAppearance: "none",
// // //                         MozAppearance: "none",
// // //                         touchAction: "manipulation",
// // //                       }}
// // //                     >
// // //                       <option value="">Select Surface Finish</option>
// // //                       <option value="Polished">Polished</option>
// // //                       <option value="Step Side">Step Side</option>
// // //                       <option value="Matt">Matt</option>
// // //                       <option value="Carving">Carving</option>
// // //                       <option value="High Gloss">High Gloss</option>
// // //                       <option value="Metallic">Metallic</option>
// // //                       <option value="Sugar">Sugar</option>
// // //                       <option value="Glue">Glue</option>
// // //                       <option value="Punch">Punch</option>
// // //                     </select>

// // //                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
// // //                       <ChevronDown className="w-4 h-4 text-gray-400" />
// // //                     </div>
// // //                   </div>

// // //                   {newTile.tileSurface && (
// // //                     <div className="flex items-center gap-2 text-xs text-green-600">
// // //                       <CheckCircle className="w-3 h-3" />
// // //                       <span>Selected: {newTile.tileSurface}</span>
// // //                     </div>
// // //                   )}
// // //                 </div>

// // //                 {/* Tile Material */}
// // //                 <div className="space-y-2">
// // //                   <label
// // //                     htmlFor="tile-material-select"
// // //                     className="block text-xs sm:text-sm font-medium text-gray-700"
// // //                   >
// // //                     Tile Material
// // //                   </label>
// // //                   <div className="relative">
// // //                     <select
// // //                       id="tile-material-select"
// // //                       name="tileMaterial"
// // //                       value={newTile.tileMaterial || ""}
// // //                       onChange={(e) => {
// // //                         console.log("Material selected:", e.target.value);
// // //                         setNewTile({
// // //                           ...newTile,
// // //                           tileMaterial: e.target.value || undefined,
// // //                         });
// // //                       }}
// // //                       onFocus={(e) => {
// // //                         e.target.click();
// // //                       }}
// // //                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
// // //                       style={{
// // //                         WebkitAppearance: "none",
// // //                         MozAppearance: "none",
// // //                         touchAction: "manipulation",
// // //                       }}
// // //                     >
// // //                       <option value="">Select Material Type</option>
// // //                       <option value="Slabs">Slabs</option>
// // //                       <option value="GVT & PGVT">GVT & PGVT</option>
// // //                       <option value="Double Charge">Double Charge</option>
// // //                       <option value="Counter Tops">Counter Tops</option>
// // //                       <option value="Full Body">Full Body</option>
// // //                       <option value="Ceramic">Ceramic</option>
// // //                       <option value="Mosaic">Mosaic</option>
// // //                       <option value="Subway">Subway</option>
// // //                     </select>

// // //                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
// // //                       <ChevronDown className="w-4 h-4 text-gray-400" />
// // //                     </div>
// // //                   </div>

// // //                   {newTile.tileMaterial && (
// // //                     <div className="flex items-center gap-2 text-xs text-green-600">
// // //                       <CheckCircle className="w-3 h-3" />
// // //                       <span>Selected: {newTile.tileMaterial}</span>
// // //                     </div>
// // //                   )}
// // //                 </div>

// // //                 {/* Price */}
// // //                 <div className="space-y-2">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// // //                     Price (₹) *
// // //                   </label>
// // //                   <input
// // //                     type="number"
// // //                     placeholder="Enter price"
// // //                     value={newTile.price || ""}
// // //                     onChange={(e) =>
// // //                       setNewTile({
// // //                         ...newTile,
// // //                         price:
// // //                           e.target.value === "" ? 0 : Number(e.target.value),
// // //                       })
// // //                     }
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
// // //                     min="0"
// // //                     step="0.01"
// // //                   />
// // //                 </div>

// // //                 {/* Stock */}
// // //                 <div className="space-y-2">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// // //                     Stock Quantity *
// // //                   </label>
// // //                   <input
// // //                     type="number"
// // //                     placeholder="Enter stock quantity"
// // //                     value={newTile.stock || ""}
// // //                     onChange={(e) =>
// // //                       setNewTile({
// // //                         ...newTile,
// // //                         stock:
// // //                           e.target.value === "" ? 0 : Number(e.target.value),
// // //                       })
// // //                     }
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
// // //                     min="0"
// // //                   />
// // //                 </div>

// // //                 {/* Main Image Upload */}
// // //                 <div className="space-y-2">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// // //                     Tile Image *
// // //                   </label>
// // //                   <div className="flex flex-col gap-2">
// // //                     <input
// // //                       type="file"
// // //                       accept="image/*"
// // //                       onChange={(e) => {
// // //                         const file = e.target.files?.[0];
// // //                         if (file) handleImageUpload(file, "image");
// // //                       }}
// // //                       className="hidden"
// // //                       id="tile-image-upload"
// // //                     />
// // //                     <label
// // //                       htmlFor="tile-image-upload"
// // //                       className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm ${
// // //                         imageUploading ? "opacity-50 cursor-not-allowed" : ""
// // //                       }`}
// // //                     >
// // //                       {imageUploading ? (
// // //                         <>
// // //                           <Loader className="w-4 h-4 animate-spin" />
// // //                           Uploading...
// // //                         </>
// // //                       ) : (
// // //                         <>
// // //                           <Upload className="w-4 h-4" />
// // //                           Choose Image
// // //                         </>
// // //                       )}
// // //                     </label>
// // //                     {newTile.imageUrl && (
// // //                       <div className="flex items-center gap-2">
// // //                         <img
// // //                           src={newTile.imageUrl}
// // //                           alt="Preview"
// // //                           className="w-16 h-16 object-cover rounded-lg border border-gray-200"
// // //                         />
// // //                         <div className="flex items-center gap-1 text-green-600">
// // //                           <CheckCircle className="w-4 h-4" />
// // //                           <span className="text-xs">Uploaded</span>
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 </div>

// // //                 {/* Texture Image Upload */}
// // //                 <div className="space-y-2">
// // //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// // //                     Texture (Optional)
// // //                   </label>
// // //                   <div className="flex flex-col gap-2">
// // //                     <input
// // //                       type="file"
// // //                       accept="image/*"
// // //                       onChange={(e) => {
// // //                         const file = e.target.files?.[0];
// // //                         if (file) handleImageUpload(file, "texture");
// // //                       }}
// // //                       className="hidden"
// // //                       id="texture-image-upload"
// // //                     />
// // //                     <label
// // //                       htmlFor="texture-image-upload"
// // //                       className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm ${
// // //                         textureUploading ? "opacity-50 cursor-not-allowed" : ""
// // //                       }`}
// // //                     >
// // //                       {textureUploading ? (
// // //                         <>
// // //                           <Loader className="w-4 h-4 animate-spin" />
// // //                           Uploading...
// // //                         </>
// // //                       ) : (
// // //                         <>
// // //                           <Upload className="w-4 h-4" />
// // //                           Choose Texture
// // //                         </>
// // //                       )}
// // //                     </label>
// // //                     {newTile.textureUrl && (
// // //                       <div className="flex items-center gap-2">
// // //                         <img
// // //                           src={newTile.textureUrl}
// // //                           alt="Texture"
// // //                           className="w-16 h-16 object-cover rounded-lg border border-gray-200"
// // //                         />
// // //                         <div className="flex items-center gap-1 text-green-600">
// // //                           <CheckCircle className="w-4 h-4" />
// // //                           <span className="text-xs">Uploaded</span>
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               {/* Form Actions */}
// // //               <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6">
// // //                 <button
// // //                   onClick={editingTile ? handleUpdateTile : handleAddTile}
// // //                   disabled={imageUploading || textureUploading}
// // //                   className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base active:scale-95"
// // //                 >
// // //                   <Save className="w-4 h-4" />
// // //                   {editingTile ? "Update Tile" : "Save Tile"}
// // //                 </button>
// // //                 <button
// // //                   onClick={() => {
// // //                     setIsAddingTile(false);
// // //                     setEditingTile(null);
// // //                     resetNewTile();
// // //                     setError(null);
// // //                   }}
// // //                   className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Desktop Table View */}
// // //           <div className="hidden lg:block overflow-x-auto">
// // //             <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
// // //               <thead>
// // //                 <tr className="bg-gray-50 border-b border-gray-200">
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Image</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Name</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Code</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Category</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Size</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Surface</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Material</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Price</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Stock</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Status</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">QR</th>
// // //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Actions</th>
// // //                 </tr>
// // //               </thead>

// // //               <tbody>
// // //                 {currentTiles.length === 0 ? (
// // //                   <tr>
// // //                     <td colSpan={12} className="text-center p-8 text-gray-500">
// // //                       {tiles.length === 0 ? (
// // //                         <div className="space-y-2">
// // //                           <Package className="w-12 h-12 text-gray-300 mx-auto" />
// // //                           <p className="font-medium">No tiles found</p>
// // //                           <p className="text-sm">Start by adding your first tile!</p>
// // //                         </div>
// // //                       ) : (
// // //                         <div className="space-y-2">
// // //                           <Search className="w-12 h-12 text-gray-300 mx-auto" />
// // //                           <p className="font-medium">No tiles match your search</p>
// // //                           <p className="text-sm">Try adjusting your search or filters</p>
// // //                         </div>
// // //                       )}
// // //                     </td>
// // //                   </tr>
// // //                 ) : (
// // //                   currentTiles.map((tile) => (
// // //                     <tr
// // //                       key={tile.id}
// // //                       className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
// // //                     >
// // //                       <td className="p-3">
// // //                         <img
// // //                           src={tile.imageUrl}
// // //                           alt={tile.name}
// // //                           className="w-12 h-12 object-cover rounded-lg border border-gray-200"
// // //                           onError={(e) => {
// // //                             (e.target as HTMLImageElement).src = "/placeholder-tile.png";
// // //                           }}
// // //                         />
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <div>
// // //                           <div className="font-medium text-gray-900 text-sm">{tile.name}</div>
// // //                           {tile.textureUrl && (
// // //                             <div className="text-xs text-green-600">Has texture</div>
// // //                           )}
// // //                         </div>
// // //                       </td>
// // //                       <td className="p-3 text-xs text-gray-600 font-mono">{tile.tileCode}</td>
// // //                       <td className="p-3">
// // //                         <span
// // //                           className={`px-2 py-1 rounded-full text-xs font-medium ${
// // //                             tile.category === "floor"
// // //                               ? "bg-blue-100 text-blue-800"
// // //                               : tile.category === "wall"
// // //                               ? "bg-purple-100 text-purple-800"
// // //                               : "bg-gray-100 text-gray-800"
// // //                           }`}
// // //                         >
// // //                           {tile.category === "both"
// // //                             ? "Both"
// // //                             : tile.category.charAt(0).toUpperCase() + tile.category.slice(1)}
// // //                         </span>
// // //                       </td>
// // //                       <td className="p-3 text-gray-600 text-sm">{tile.size}</td>
// // //                       <td className="p-3 text-xs sm:text-sm">
// // //                         {tile.tileSurface ? (
// // //                           <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
// // //                             <span>🔘</span>
// // //                             <span>{tile.tileSurface}</span>
// // //                           </span>
// // //                         ) : (
// // //                           <span className="text-gray-400 text-xs">—</span>
// // //                         )}
// // //                       </td>
// // //                       <td className="p-3 text-xs sm:text-sm">
// // //                         {tile.tileMaterial ? (
// // //                           <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
// // //                             <span>🧱</span>
// // //                             <span>{tile.tileMaterial}</span>
// // //                           </span>
// // //                         ) : (
// // //                           <span className="text-gray-400 text-xs">—</span>
// // //                         )}
// // //                       </td>
// // //                       <td className="p-3 font-semibold text-gray-900 text-sm">
// // //                         ₹{tile.price.toLocaleString()}
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <div className="text-sm">
// // //                           <div className="font-medium">{tile.stock || 0}</div>
// // //                           {(tile.stock || 0) < 10 && tile.inStock && (
// // //                             <div className="text-xs text-orange-600">Low</div>
// // //                           )}
// // //                         </div>
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <span
// // //                           className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(tile)}`}
// // //                         >
// // //                           {getStockStatusText(tile)}
// // //                         </span>
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <span
// // //                           className={`px-2 py-1 rounded-full text-xs font-medium ${
// // //                             tile.qrCode
// // //                               ? "bg-green-100 text-green-800"
// // //                               : "bg-orange-100 text-orange-800"
// // //                           }`}
// // //                         >
// // //                           {tile.qrCode ? "✓" : "○"}
// // //                         </span>
// // //                       </td>
// // //                       <td className="p-3">
// // //                         <div className="flex gap-2">
// // //                           <button
// // //                             onClick={() => handleEditTile(tile)}
// // //                             className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
// // //                             title="Edit"
// // //                           >
// // //                             <Edit className="w-4 h-4" />
// // //                           </button>
// // //                           <button
// // //                             onClick={() => handleDeleteTile(tile.id, tile.name)}
// // //                             className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
// // //                             title="Delete"
// // //                           >
// // //                             <Trash2 className="w-4 h-4" />
// // //                           </button>
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                   ))
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           {/* Mobile/Tablet Card View */}
// // //           <div className="lg:hidden space-y-3">
// // //             {currentTiles.length === 0 ? (
// // //               <div className="text-center py-12 text-gray-500">
// // //                 {tiles.length === 0 ? (
// // //                   <div className="space-y-2">
// // //                     <Package className="w-16 h-16 text-gray-300 mx-auto" />
// // //                     <p className="font-medium">No tiles found</p>
// // //                     <p className="text-sm">Start by adding your first tile!</p>
// // //                   </div>
// // //                 ) : (
// // //                   <div className="space-y-2">
// // //                     <Search className="w-16 h-16 text-gray-300 mx-auto" />
// // //                     <p className="font-medium">No tiles match your search</p>
// // //                     <p className="text-sm">Try adjusting your search or filters</p>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             ) : (
// // //               currentTiles.map((tile) => (
// // //                 <div
// // //                   key={tile.id}
// // //                   className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
// // //                 >
// // //                   <div className="flex gap-3">
// // //                     {/* Image */}
// // //                     <div className="flex-shrink-0">
// // //                       <img
// // //                         src={tile.imageUrl}
// // //                         alt={tile.name}
// // //                         className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200"
// // //                         onError={(e) => {
// // //                           (e.target as HTMLImageElement).src = "/placeholder-tile.png";
// // //                         }}
// // //                       />
// // //                     </div>

// // //                     {/* Details */}
// // //                     <div className="flex-1 min-w-0">
// // //                       {/* Title Row */}
// // //                       <div className="flex items-start justify-between gap-2 mb-2">
// // //                         <div className="min-w-0 flex-1">
// // //                           <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
// // //                             {tile.name}
// // //                           </h3>
// // //                           <p className="text-xs text-gray-500 font-mono">{tile.tileCode}</p>
// // //                         </div>
// // //                         <div className="flex gap-1 flex-shrink-0">
// // //                           <button
// // //                             onClick={() => handleEditTile(tile)}
// // //                             className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
// // //                           >
// // //                             <Edit className="w-4 h-4" />
// // //                           </button>
// // //                           <button
// // //                             onClick={() => handleDeleteTile(tile.id, tile.name)}
// // //                             className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
// // //                           >
// // //                             <Trash2 className="w-4 h-4" />
// // //                           </button>
// // //                         </div>
// // //                       </div>

// // //                       {/* Info Grid */}
// // //                       <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
// // //                         <div>
// // //                           <span className="text-gray-500">Category:</span>
// // //                           <div className="mt-0.5">
// // //                             <span
// // //                               className={`px-2 py-0.5 rounded-full text-xs font-medium ${
// // //                                 tile.category === "floor"
// // //                                   ? "bg-blue-100 text-blue-800"
// // //                                   : tile.category === "wall"
// // //                                   ? "bg-purple-100 text-purple-800"
// // //                                   : "bg-gray-100 text-gray-800"
// // //                               }`}
// // //                             >
// // //                               {tile.category === "both" ? "Both" : tile.category}
// // //                             </span>
// // //                           </div>
// // //                         </div>
// // //                         <div>
// // //                           <span className="text-gray-500">Size:</span>
// // //                           <div className="font-medium text-gray-900">{tile.size}</div>
// // //                         </div>
// // //                         <div>
// // //                           <span className="text-gray-500">Price:</span>
// // //                           <div className="font-semibold text-gray-900">
// // //                             ₹{tile.price.toLocaleString()}
// // //                           </div>
// // //                         </div>
// // //                         <div>
// // //                           <span className="text-gray-500">Stock:</span>
// // //                           <div className="font-medium text-gray-900">
// // //                             {tile.stock || 0}
// // //                             {(tile.stock || 0) < 10 && tile.inStock && (
// // //                               <span className="text-orange-600 ml-1">(Low)</span>
// // //                             )}
// // //                           </div>
// // //                         </div>
// // //                       </div>

// // //                       {/* Surface & Material Accordion */}
// // //                       {(tile.tileSurface || tile.tileMaterial) && (
// // //                         <div className="mt-3 border-t border-gray-200 pt-3">
// // //                           <button
// // //                             onClick={() =>
// // //                               setExpandedTileId(expandedTileId === tile.id ? null : tile.id)
// // //                             }
// // //                             className="w-full flex items-center justify-between text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
// // //                           >
// // //                             <span className="flex items-center gap-1.5">
// // //                               <Package className="w-3.5 h-3.5" />
// // //                               Tile Specifications
// // //                             </span>
// // //                             {expandedTileId === tile.id ? (
// // //                               <ChevronUp className="w-4 h-4 text-gray-500" />
// // //                             ) : (
// // //                               <ChevronDown className="w-4 h-4 text-gray-500" />
// // //                             )}
// // //                           </button>

// // //                           {expandedTileId === tile.id && (
// // //                             <div className="mt-2 space-y-2 animate-slide-down">
// // //                               {tile.tileSurface && (
// // //                                 <div className="flex items-center justify-between text-xs">
// // //                                   <span className="text-gray-600 flex items-center gap-1">
// // //                                     <span>🔘</span>
// // //                                     Surface:
// // //                                   </span>
// // //                                   <span className="font-medium text-gray-900 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
// // //                                     {tile.tileSurface}
// // //                                   </span>
// // //                                 </div>
// // //                               )}
// // //                               {tile.tileMaterial && (
// // //                                 <div className="flex items-center justify-between text-xs">
// // //                                   <span className="text-gray-600 flex items-center gap-1">
// // //                                     <span>🧱</span>
// // //                                     Material:
// // //                                   </span>
// // //                                   <span className="font-medium text-gray-900 bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
// // //                                     {tile.tileMaterial}
// // //                                   </span>
// // //                                 </div>
// // //                               )}
// // //                             </div>
// // //                           )}
// // //                         </div>
// // //                       )}

// // //                       {/* Status Row */}
// // //                       <div className="flex items-center gap-2 mt-2 flex-wrap">
// // //                         <span
// // //                           className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(tile)}`}
// // //                         >
// // //                           {getStockStatusText(tile)}
// // //                         </span>
// // //                         <span
// // //                           className={`px-2 py-1 rounded-full text-xs font-medium ${
// // //                             tile.qrCode
// // //                               ? "bg-green-100 text-green-800"
// // //                               : "bg-orange-100 text-orange-800"
// // //                           }`}
// // //                         >
// // //                           QR: {tile.qrCode ? "Yes" : "No"}
// // //                         </span>
// // //                         {tile.textureUrl && (
// // //                           <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
// // //                             Has Texture
// // //                           </span>
// // //                         )}
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               ))
// // //             )}
// // //           </div>

// // //           {/* ✅ PAGINATION COMPONENT - RESPONSIVE */}
// // //           {totalPages > 1 && (
// // //             <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4">
// // //               {/* Page Info - Mobile */}
// // //               <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
// // //                 Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
// // //               </div>

// // //               {/* Pagination Controls */}
// // //               <div className="flex items-center gap-2 order-1 sm:order-2">
// // //                 {/* Previous Button */}
// // //                 <button
// // //                   onClick={goToPreviousPage}
// // //                   disabled={currentPage === 1}
// // //                   className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
// // //                     currentPage === 1
// // //                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
// // //                       : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
// // //                   }`}
// // //                 >
// // //                   <ChevronLeft className="w-4 h-4" />
// // //                   <span className="hidden sm:inline">Previous</span>
// // //                 </button>

// // //                 {/* Page Numbers */}
// // //                 <div className="flex items-center gap-1">
// // //                   {getPageNumbers().map((page, index) => {
// // //                     if (page === '...') {
// // //                       return (
// // //                         <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
// // //                           ...
// // //                         </span>
// // //                       );
// // //                     }
// // //                     return (
// // //                       <button
// // //                         key={page}
// // //                         onClick={() => goToPage(page as number)}
// // //                         className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
// // //                           currentPage === page
// // //                             ? "bg-green-600 text-white"
// // //                             : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
// // //                         }`}
// // //                       >
// // //                         {page}
// // //                       </button>
// // //                     );
// // //                   })}
// // //                 </div>

// // //                 {/* Next Button */}
// // //                 <button
// // //                   onClick={goToNextPage}
// // //                   disabled={currentPage === totalPages}
// // //                   className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
// // //                     currentPage === totalPages
// // //                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
// // //                       : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
// // //                   }`}
// // //                 >
// // //                   <span className="hidden sm:inline">Next</span>
// // //                   <ChevronRight className="w-4 h-4" />
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </>
// // //       )}

// // //       {/* Other Tabs - Wrapped for Responsiveness */}
// // //       <div className="overflow-hidden">
// // //         {activeTab === "worker" && <WorkerManagement />}
// // //         {activeTab === "profile" && <SellerProfile />}
// // //         {activeTab === "excel" && <ExcelUpload onUploadComplete={loadData} />}
// // //         {activeTab === "stock-analytics" && <SellerStockAnalytics />}
// // //         {activeTab === "bulk" && <BulkUpload onUploadComplete={loadData} />}
// // //         {activeTab === "customer-inquiries" && <CustomerInquiriesManager />}
// // //         {activeTab === "qrcodes" && (
// // //           <QRCodeManager tiles={tiles} sellerId={currentUser?.user_id} onQRCodeGenerated={loadData} />
// // //         )}
// // //         {activeTab === "analytics" && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
// // //       </div>
// // //     </div>
// // //   );
// // // }; 
// // import React, { useState, useEffect } from "react";
// // import {
// //   Plus,
// //   Edit,
// //   Trash2,
// //   Upload,
// //   Save,
// //   Store,
// //   Package,
// //   FileSpreadsheet,
// //   AlertCircle,
// //   CheckCircle,
// //   Loader,
// //   Search,
// //   Filter,
// //   Users,
// //   RefreshCw,
// //   ChevronUp,
// //   ChevronDown,
// //   Eye,
// //   TrendingUp,
// //   QrCode,
// //   Download,
// //   User,
// //   Menu,
// //   X,
// //   ChevronLeft,
// //   ChevronRight,
// // } from "lucide-react";
// // import { Tile } from "../types";
// // import { useAppStore } from "../stores/appStore";
// // import { BulkUpload } from "./BulkUpload";
// // import { AnalyticsDashboard } from "./AnalyticsDashboard";
// // import { QRCodeManager } from "./QRCodeManager";
// // import { ExcelUpload } from "./ExcelUpload";
// // import { generateTileQRCode } from "../utils/qrCodeUtils";
// // import { SellerProfile } from "./SellerProfile";
// // import { WorkerManagement } from "./WorkerManagement";
// // import { SellerStockAnalytics } from "./SellerStockAnalytics";
// // import { CustomerInquiriesManager } from './CustomerInquiriesManager';
// // import { PlanStatusBanner } from './PlanStatusBanner';
// // // ═══════════════════════════════════════════════════════════════
// // // ✅ PAYMENT SYSTEM IMPORTS (RAZORPAY)
// // // ═══════════════════════════════════════════════════════════════
// // import { PlansModal } from './Payment/PlansModal';
// // import { PaymentConfirmationModal } from './Payment/PaymentConfirmationModal';
// // import { PaymentCheckout } from './Payment/PaymentCheckout';
// // import { initiatePayment } from '../lib/paymentService';
// // import { getPlanById } from '../lib/planService';
// // import type { Plan } from '../types/plan.types';
// // import type { RazorpayCheckoutOptions } from '../types/payment.types';
// // import { auth } from '../lib/firebase';

// // import {
// //   uploadTile,
// //   updateTile,
// //   deleteTile,
// //   getSellerProfile,
// //   getSellerTiles,
// //   updateTileQRCode,
// //   getTileById,
// // } from "../lib/firebaseutils";

// // import { uploadToCloudinary } from "../utils/cloudinaryUtils";

// // // ═══════════════════════════════════════════════════════════════
// // // ✅ MAIN SELLER DASHBOARD COMPONENT
// // // ═══════════════════════════════════════════════════════════════

// // export const SellerDashboard: React.FC = () => {
// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ STATE MANAGEMENT
// //   // ═══════════════════════════════════════════════════════════════

// //   const { currentUser, isAuthenticated } = useAppStore();
  
// //   // Tab Management
// //   const [isAddingTile, setIsAddingTile] = useState(false);
// //   const [activeTab, setActiveTab] = useState<
// //     | "tiles"
// //     | "bulk"
// //     | "excel"
// //     | "analytics"
// //     | "qrcodes"
// //     | "profile"
// //     | "worker"
// //     | "scan"
// //     | "stock-analytics"
// //     | "customer-inquiries"
// //   >("tiles");

// //   // Tile Management
// //   const [editingTile, setEditingTile] = useState<Tile | null>(null);
// //   const [sellerProfile, setSellerProfile] = useState<any>(null);
// //   const [tiles, setTiles] = useState<Tile[]>([]);
// //   const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
// //   const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0);
  
// //   // UI State
// //   const [loading, setLoading] = useState(true);
// //   const [imageUploading, setImageUploading] = useState(false);
// //   const [textureUploading, setTextureUploading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [success, setSuccess] = useState<string | null>(null);
  
// //   // Filter State
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [categoryFilter, setCategoryFilter] = useState<string>("all");
// //   const [stockFilter, setStockFilter] = useState<string>("all");
  
// //   // Mobile UI
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// //   const [expandedTileId, setExpandedTileId] = useState<string | null>(null);

// //   // Pagination State
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage] = useState(10);

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ PAYMENT STATE (RAZORPAY)
// //   // ═══════════════════════════════════════════════════════════════

// //   const [showPlansModal, setShowPlansModal] = useState(false);
// //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// //   const [paymentId, setPaymentId] = useState<string | null>(null);
// //   const [processingPayment, setProcessingPayment] = useState(false);

// //   // New Tile Form State
// //   const [newTile, setNewTile] = useState<Partial<Tile>>({
// //     name: "",
// //     category: "both",
// //     size: "",
// //     price: undefined,
// //     stock: 0,
// //     inStock: true,
// //     imageUrl: "",
// //     textureUrl: "",
// //     tileCode: "",
// //     tileSurface: "",
// //     tileMaterial: "",
// //   });

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ EFFECTS
// //   // ═══════════════════════════════════════════════════════════════

// //   // Initial Load
// //   useEffect(() => {
// //     console.log("🔍 SellerDashboard Auth Check:", {
// //       currentUser: currentUser?.email || "null",
// //       isAuthenticated,
// //       userRole: currentUser?.role || "null",
// //     });

// //     if (currentUser && isAuthenticated) {
// //       loadData();
// //     } else if (currentUser === null && !isAuthenticated) {
// //       setLoading(false);
// //     }
// //   }, [currentUser, isAuthenticated]);

// //   // Filter and Reset Pagination
// //   useEffect(() => {
// //     filterTiles();
// //     setCurrentPage(1);
// //   }, [tiles, searchTerm, categoryFilter, stockFilter]);

// //   // Auto-dismiss Alerts
// //   useEffect(() => {
// //     if (error || success) {
// //       const timer = setTimeout(() => {
// //         setError(null);
// //         setSuccess(null);
// //       }, 5000);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [error, success]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ DATA LOADING
// //   // ═══════════════════════════════════════════════════════════════

// //   const loadData = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       console.log("🔄 Loading seller data for:", currentUser?.email);

// //       const [profile, sellerTiles] = await Promise.all([
// //         getSellerProfile(currentUser?.user_id || ""),
// //         getSellerTiles(currentUser?.user_id || ""),
// //       ]);

// //       setSellerProfile(profile);

// //       if (sellerTiles && sellerTiles.length > 0) {
// //         const uniqueTilesMap = new Map();
// //         sellerTiles.forEach((tile) => {
// //           if (tile.id && !uniqueTilesMap.has(tile.id)) {
// //             uniqueTilesMap.set(tile.id, tile);
// //           }
// //         });

// //         const uniqueTiles = Array.from(uniqueTilesMap.values());

// //         console.log("✅ Seller data loaded:", {
// //           profile: profile?.business_name || "No profile",
// //           tilesRaw: sellerTiles.length,
// //           tilesUnique: uniqueTiles.length,
// //         });

// //         setTiles(uniqueTiles);
// //       } else {
// //         setTiles([]);
// //         console.log("ℹ️ No tiles found");
// //       }
// //     } catch (error: any) {
// //       console.error("❌ Error loading seller data:", error);
// //       setError("Failed to load dashboard data. Please refresh the page.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ FILTERING
// //   // ═══════════════════════════════════════════════════════════════

// //   const filterTiles = () => {
// //     let filtered = tiles;

// //     if (searchTerm) {
// //       filtered = filtered.filter(
// //         (tile) =>
// //           tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           tile.tileCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           tile.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           tile.tileSurface?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           tile.tileMaterial?.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //     }

// //     if (categoryFilter !== "all") {
// //       filtered = filtered.filter((tile) => tile.category === categoryFilter);
// //     }

// //     if (stockFilter === "in-stock") {
// //       filtered = filtered.filter((tile) => tile.inStock);
// //     } else if (stockFilter === "out-of-stock") {
// //       filtered = filtered.filter((tile) => !tile.inStock);
// //     }

// //     setFilteredTiles(filtered);
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ PAGINATION
// //   // ═══════════════════════════════════════════════════════════════

// //   const totalPages = Math.ceil(filteredTiles.length / itemsPerPage);
// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentTiles = filteredTiles.slice(indexOfFirstItem, indexOfLastItem);

// //   const goToPage = (pageNumber: number) => {
// //     setCurrentPage(pageNumber);
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const goToNextPage = () => {
// //     if (currentPage < totalPages) {
// //       setCurrentPage(currentPage + 1);
// //       window.scrollTo({ top: 0, behavior: 'smooth' });
// //     }
// //   };

// //   const goToPreviousPage = () => {
// //     if (currentPage > 1) {
// //       setCurrentPage(currentPage - 1);
// //       window.scrollTo({ top: 0, behavior: 'smooth' });
// //     }
// //   };

// //   const getPageNumbers = () => {
// //     const pages = [];
// //     const maxPagesToShow = 5;

// //     if (totalPages <= maxPagesToShow) {
// //       for (let i = 1; i <= totalPages; i++) {
// //         pages.push(i);
// //       }
// //     } else {
// //       if (currentPage <= 3) {
// //         for (let i = 1; i <= 4; i++) pages.push(i);
// //         pages.push('...');
// //         pages.push(totalPages);
// //       } else if (currentPage >= totalPages - 2) {
// //         pages.push(1);
// //         pages.push('...');
// //         for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
// //       } else {
// //         pages.push(1);
// //         pages.push('...');
// //         for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
// //         pages.push('...');
// //         pages.push(totalPages);
// //       }
// //     }

// //     return pages;
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ PAYMENT HANDLERS
// //   // ═══════════════════════════════════════════════════════════════

// //   const handlePlanSelection = async (planId: string) => {
// //     try {
// //       console.log('📦 Selected plan:', planId);
      
// //       if (!isAuthenticated) {
// //         console.log('🔐 User not authenticated');
// //         setShowPlansModal(false);
// //         setError('Please login to select a plan');
// //         return;
// //       }

// //       console.log('📋 Fetching plan details...');
// //       const plan = await getPlanById(planId);
      
// //       if (!plan) {
// //         setError('❌ Plan not found. Please try again.');
// //         return;
// //       }

// //       setSelectedPlan(plan);
// //       setShowPlansModal(false);
// //       setShowPaymentConfirmation(true);
      
// //     } catch (error: any) {
// //       console.error('❌ Error selecting plan:', error);
// //       setError(`❌ Error: ${error.message}`);
// //     }
// //   };

// //   const handlePaymentConfirm = async () => {
// //     if (!selectedPlan) {
// //       setError('❌ No plan selected');
// //       return;
// //     }

// //     setProcessingPayment(true);

// //     try {
// //       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

// //       const currentUserAuth = auth.currentUser;
// //       if (!currentUserAuth) {
// //         throw new Error('Please login first');
// //       }

// //       const result = await initiatePayment(
// //         selectedPlan.id,
// //         selectedPlan.plan_name,
// //         selectedPlan.price
// //       );

// //       if (!result.success || !result.checkoutOptions || !result.paymentId) {
// //         throw new Error(result.error || 'Failed to initiate payment');
// //       }

// //       console.log('✅ Payment initiated successfully');
// //       console.log('📝 Payment ID:', result.paymentId);

// //       setCheckoutOptions(result.checkoutOptions);
// //       setPaymentId(result.paymentId);
// //       setShowPaymentConfirmation(false);
// //        setPlanRefreshTrigger(prev => prev + 1);

// //     } catch (error: any) {
// //       console.error('❌ Payment initiation error:', error);
// //       setError(`❌ Payment Error: ${error.message}`);
// //       setProcessingPayment(false);
// //     }
// //   };

// //   const handlePaymentError = (error: string) => {
// //     console.error('❌ Payment checkout error:', error);
// //     setError(`❌ Payment Error: ${error}`);
    
// //     setCheckoutOptions(null);
// //     setPaymentId(null);
// //     setProcessingPayment(false);
// //     setSelectedPlan(null);
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ TILE MANAGEMENT FUNCTIONS
// //   // ═══════════════════════════════════════════════════════════════

// //   const generateTileCode = (): string => {
// //     const prefix =
// //       sellerProfile?.business_name?.substring(0, 3).toUpperCase() || "TIL";
// //     const timestamp = Date.now().toString().slice(-6);
// //     const random = Math.random().toString(36).substring(2, 4).toUpperCase();
// //     return `${prefix}${timestamp}${random}`;
// //   };

// //   const handleImageUpload = async (file: File, type: "image" | "texture") => {
// //     try {
// //       if (type === "image") {
// //         setImageUploading(true);
// //       } else {
// //         setTextureUploading(true);
// //       }

// //       if (!file.type.startsWith("image/")) {
// //         throw new Error("Please select a valid image file");
// //       }

// //       if (file.size > 5 * 1024 * 1024) {
// //         throw new Error("Image size should be less than 5MB");
// //       }

// //       console.log(`🔄 Uploading ${type}:`, file.name);
// //       const imageUrl = await uploadToCloudinary(
// //         file,
// //         type === "image" ? "tiles/main" : "tiles/textures"
// //       );

// //       if (type === "image") {
// //         setNewTile((prev) => ({ ...prev, imageUrl }));
// //       } else {
// //         setNewTile((prev) => ({ ...prev, textureUrl: imageUrl }));
// //       }

// //       setSuccess(
// //         `${type === "image" ? "Image" : "Texture"} uploaded successfully`
// //       );
// //       console.log(`✅ ${type} uploaded:`, imageUrl);
// //     } catch (error: any) {
// //       console.error(`❌ ${type} upload failed:`, error);
// //       setError(error.message || `Failed to upload ${type}`);
// //     } finally {
// //       if (type === "image") {
// //         setImageUploading(false);
// //       } else {
// //         setTextureUploading(false);
// //       }
// //     }
// //   };

// //   const validateTileForm = (): string | null => {
// //     if (!newTile.name?.trim()) {
// //       return "❌ Tile Name is required. Please enter a tile name.";
// //     }

// //     if (!newTile.size?.trim()) {
// //       return "❌ Tile Size is required. Please enter or select a size (e.g., 60x60 cm).";
// //     }

// //     if (!newTile.price || newTile.price <= 0) {
// //       return "❌ Valid Price is required. Please enter a price greater than 0.";
// //     }

// //     if (newTile.stock === undefined || newTile.stock < 0) {
// //       return "❌ Valid Stock Quantity is required. Please enter stock (0 or more).";
// //     }

// //     if (!newTile.imageUrl?.trim()) {
// //       return "❌ Tile Image is required. Please upload an image before saving.";
// //     }

// //     return null;
// //   };

// //   const handleAddTile = async () => {
// //     try {
// //       setError(null);

// //       const validationError = validateTileForm();
// //       if (validationError) {
// //         setError(validationError);
// //         window.scrollTo({ top: 0, behavior: "smooth" });
// //         setTimeout(() => {
// //           setError((prev) => (prev === validationError ? null : prev));
// //         }, 8000);
// //         return;
// //       }

// //       if (!currentUser) {
// //         setError("User not authenticated");
// //         window.scrollTo({ top: 0, behavior: "smooth" });
// //         return;
// //       }

// //       console.log("🔄 Step 1/4: Preparing tile data...");

// //       const tileCode = newTile.tileCode || generateTileCode();

// //       const baseTileData = {
// //         ...newTile,
// //         sellerId: currentUser.user_id,
// //         showroomId: currentUser.user_id,
// //         tileCode: tileCode,
// //         inStock: (newTile.stock || 0) > 0,
// //         createdAt: new Date().toISOString(),
// //         updatedAt: new Date().toISOString(),
// //       };

// //       console.log("💾 Step 2/4: Saving tile to database...");

// //       const savedTile = await uploadTile(baseTileData);

// //       if (!savedTile || !savedTile.id) {
// //         throw new Error("Tile saved but ID not returned");
// //       }

// //       console.log("✅ Tile saved with ID:", savedTile.id);
// //       console.log("📱 Step 3/4: Generating QR code...");

// //       let qrCodeGenerated = false;
// //       try {
// //         const qrCodeDataUrl = await generateTileQRCode(savedTile);
// //         console.log("✅ QR code generated successfully");
// //         console.log("🔄 Step 4/4: Updating tile with QR code...");
// //         await updateTileQRCode(savedTile.id, qrCodeDataUrl);
// //         console.log("✅ Tile updated with QR code");
// //         qrCodeGenerated = true;
// //       } catch (qrError: any) {
// //         console.warn("⚠️ QR code generation failed:", qrError.message);
// //       }

// //       await loadData();

// //       setIsAddingTile(false);
// //       resetNewTile();

// //       if (qrCodeGenerated) {
// //         setSuccess("✅ Tile added successfully with QR code!");
// //       } else {
// //         setSuccess("✅ Tile added! QR code can be generated from QR Codes tab.");
// //       }

// //       console.log("🎉 Tile creation completed!");
// //     } catch (error: any) {
// //       console.error("❌ Tile creation failed:", error);
// //       setError(`Failed to add tile: ${error.message}`);
// //     }
// //   };

// //   const handleEditTile = async (tile: Tile) => {
// //     console.log("🔄 Editing tile:", tile.name);
// //     setEditingTile(tile);
// //     setNewTile({
// //       ...tile,
// //       stock: tile.stock || 0,
// //     });
// //     setIsAddingTile(false);
// //     setError(null);
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const handleUpdateTile = async () => {
// //     try {
// //       setError(null);

// //       const validationError = validateTileForm();
// //       if (validationError) {
// //         setError(validationError);
// //         return;
// //       }

// //       if (!editingTile) {
// //         setError("No tile selected for editing");
// //         return;
// //       }

// //       console.log("🔄 Starting tile update:", editingTile.name);

// //       const updates = {
// //         ...newTile,
// //         inStock: (newTile.stock || 0) > 0,
// //         updatedAt: new Date().toISOString(),
// //       };

// //       console.log("💾 Updating tile in database...");
// //       await updateTile(editingTile.id, updates);
// //       console.log("✅ Tile updated in database");

// //       const criticalFieldsChanged =
// //         editingTile.name !== newTile.name ||
// //         editingTile.tileCode !== newTile.tileCode ||
// //         editingTile.price !== newTile.price ||
// //         editingTile.size !== newTile.size ||
// //         editingTile.category !== newTile.category;

// //       if (criticalFieldsChanged) {
// //         console.log("🔄 Critical fields changed, attempting QR regeneration...");

// //         setTimeout(async () => {
// //           try {
// //             if (typeof getTileById !== "function") {
// //               console.warn("⚠️ getTileById not available, skipping QR regeneration");
// //               return;
// //             }

// //             if (typeof generateTileQRCode !== "function") {
// //               console.warn("⚠️ generateTileQRCode not available, skipping QR regeneration");
// //               return;
// //             }

// //             if (typeof updateTileQRCode !== "function") {
// //               console.warn("⚠️ updateTileQRCode not available, skipping QR regeneration");
// //               return;
// //             }

// //             console.log("📱 Fetching updated tile data...");
// //             const updatedTileData = await getTileById(editingTile.id);

// //             if (!updatedTileData) {
// //               console.warn("⚠️ Could not fetch updated tile, skipping QR regeneration");
// //               return;
// //             }

// //             console.log("📱 Generating new QR code...");
// //             const newQRCode = await generateTileQRCode(updatedTileData);

// //             if (!newQRCode || !newQRCode.startsWith("data:image")) {
// //               console.warn("⚠️ Invalid QR code generated, skipping update");
// //               return;
// //             }

// //             console.log("💾 Updating QR code in database...");
// //             await updateTileQRCode(editingTile.id, newQRCode);

// //             console.log("✅ QR code regenerated successfully");

// //             await loadData();
// //           } catch (qrError: any) {
// //             console.error("⚠️ QR regeneration failed (non-critical):", qrError.message);
// //           }
// //         }, 0);
// //       } else {
// //         console.log("ℹ️ No critical fields changed, keeping existing QR code");
// //       }

// //       console.log("🔄 Reloading tiles list...");
// //       await loadData();

// //       setEditingTile(null);
// //       resetNewTile();

// //       setSuccess("Tile updated successfully!");
// //       console.log("✅ Tile update complete");
// //     } catch (error: any) {
// //       console.error("❌ Error updating tile:", error);
// //       setError(`Failed to update tile: ${error.message}`);
// //     }
// //   };

// //   const handleDeleteTile = async (tileId: string, tileName: string) => {
// //     if (!window.confirm(`Delete "${tileName}"?`)) return;

// //     try {
// //       setError(null);
// //       console.log("🔥 Deleting:", tileId);

// //       await deleteTile(tileId);

// //       console.log("✅ Deleted from database");

// //       await loadData();

// //       setSuccess("Tile deleted successfully");
// //     } catch (error: any) {
// //       console.error("❌ Delete failed:", error);
// //       setError(`Delete failed: ${error.message}`);
// //     }
// //   };

// //   const resetNewTile = () => {
// //     setNewTile({
// //       name: "",
// //       category: "both",
// //       size: "",
// //       price: 0,
// //       stock: 0,
// //       inStock: true,
// //       imageUrl: "",
// //       textureUrl: "",
// //       tileCode: "",
// //       tileSurface: "",
// //       tileMaterial: "",
// //     });
// //   };

// //   const handleTabChange = (tab: typeof activeTab) => {
// //     setActiveTab(tab);
// //     setError(null);
// //     setSuccess(null);
// //     setMobileMenuOpen(false);
// //     console.log("🎯 Switched to tab:", tab);
// //   };

// //   const getStockStatusColor = (tile: Tile) => {
// //     if (!tile.inStock) return "bg-red-100 text-red-800";
// //     if ((tile.stock || 0) < 10) return "bg-yellow-100 text-yellow-800";
// //     return "bg-green-100 text-green-800";
// //   };

// //   const getStockStatusText = (tile: Tile) => {
// //     if (!tile.inStock) return "Out of Stock";
// //     if ((tile.stock || 0) < 10) return "Low Stock";
// //     return "In Stock";
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ RENDER GUARDS
// //   // ═══════════════════════════════════════════════════════════════

// //   if (!isAuthenticated) {
// //     return (
// //       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
// //         <div className="text-center py-8 sm:py-12">
// //           <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
// //           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
// //             Authentication Required
// //           </h2>
// //           <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
// //             Please log in to access the seller dashboard.
// //           </p>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
// //           >
// //             Refresh Page
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!currentUser) {
// //     return (
// //       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
// //         <div className="text-center py-8 sm:py-12">
// //           <User className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
// //           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
// //             User Profile Not Found
// //           </h2>
// //           <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
// //             Unable to load user profile. Please try logging in again.
// //           </p>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
// //           >
// //             Reload Dashboard
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (currentUser.role !== "seller") {
// //     return (
// //       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
// //         <div className="text-center py-8 sm:py-12">
// //           <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-4" />
// //           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
// //             Access Denied
// //           </h2>
// //           <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
// //             This dashboard is only accessible to sellers. Your role:{" "}
// //             <strong>{currentUser.role}</strong>
// //           </p>
// //           <button
// //             onClick={() => (window.location.href = "/")}
// //             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
// //           >
// //             Go to Home
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (loading) {
// //     return (
// //       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
// //         <div className="flex items-center justify-center h-64">
// //           <div className="text-center">
// //             <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-green-600 mx-auto mb-4" />
// //             <p className="text-gray-600 text-base sm:text-lg">
// //               Loading dashboard...
// //             </p>
// //             <p className="text-gray-500 text-xs sm:text-sm mt-2 px-4">
// //               Loading data for {currentUser.full_name || currentUser.email}
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ MAIN RENDER
// //   // ═══════════════════════════════════════════════════════════════

// //   return (
// //     <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
// //       {/* ═══════════════════════════════════════════════════════════════ */}
// //       {/* ✅ HEADER */}
// //       {/* ═══════════════════════════════════════════════════════════════ */}
// //       <div className="flex flex-col gap-4 mb-4 sm:mb-6">
// //         {/* Title Section */}
// //         <div className="flex items-start justify-between gap-3">
// //           <div className="flex items-center gap-2 sm:gap-3 min-w-0">
// //             <Store className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
// //             <div className="min-w-0">
// //               <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
// //                 Seller Dashboard
// //               </h2>
// //               <p className="text-xs sm:text-sm text-gray-600 truncate">
// //                 {sellerProfile?.business_name || "Your Business"}
// //               </p>

// //               <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500">
// //                 <span className="flex items-center gap-1 whitespace-nowrap">
// //                   <Package className="w-3 h-3 sm:w-4 sm:h-4" />
// //                   {tiles.length} Total
// //                 </span>
// //                 <span className="flex items-center gap-1 text-green-600 whitespace-nowrap">
// //                   <Package className="w-3 h-3 sm:w-4 sm:h-4" />
// //                   {tiles.filter((t) => t.inStock).length} Stock
// //                 </span>
// //                 <span className="flex items-center gap-1 text-red-600 whitespace-nowrap">
// //                   <Package className="w-3 h-3 sm:w-4 sm:h-4" />
// //                   {tiles.filter((t) => !t.inStock).length} Out
// //                 </span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Mobile Menu Toggle */}
// //           <button
// //             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //             className="lg:hidden flex-shrink-0 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
// //           >
// //             {mobileMenuOpen ? (
// //               <X className="w-6 h-6" />
// //             ) : (
// //               <Menu className="w-6 h-6" />
// //             )}
// //           </button>
// //         </div>
// //         {/* ✅ PLAN STATUS BANNER */}
// // <PlanStatusBanner 
// //   sellerId={currentUser?.user_id || ''} 
// //   onViewPlans={() => setShowPlansModal(true)}
// //   forceRefresh={planRefreshTrigger}
// // />
// //         {/* ═══════════════════════════════════════════════════════════════ */}
// //         {/* ✅ NAVIGATION TABS - DESKTOP */}
// //         {/* ═══════════════════════════════════════════════════════════════ */}
// //         <div className="hidden lg:flex gap-2 flex-wrap">
// //           <button
// //             onClick={() => handleTabChange("tiles")}
// //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //               activeTab === "tiles"
// //                 ? "bg-green-600 text-white shadow-md"
// //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// //             }`}
// //           >
// //             <Edit className="w-4 h-4" />
// //             My Tiles
// //           </button>
          
// //           <button
// //             onClick={() => handleTabChange("worker")}
// //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //               activeTab === "worker"
// //                 ? "bg-green-600 text-white shadow-md"
// //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// //             }`}
// //           >
// //             <User className="w-4 h-4" />
// //             Worker
// //           </button>
          
// //           <button
// //             onClick={() => handleTabChange("customer-inquiries")}
// //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //               activeTab === "customer-inquiries"
// //                 ? "bg-green-600 text-white shadow-md"
// //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// //             }`}
// //           >
// //             <Users className="w-4 h-4" />
// //             Customers
// //           </button>
          
// //           {/* ✅ VIEW PLANS BUTTON - BEFORE SCAN */}
// //           <button
// //             onClick={() => setShowPlansModal(true)}
// //             className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
// //           >
// //             <Eye className="w-4 h-4" />
// //             View Plans
// //           </button>
          
// //           {/* SCAN BUTTON */}
// //           <button
// //             onClick={() => window.open("/scan", "_blank")}
// //             className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700 text-sm font-medium shadow-md hover:shadow-lg"
// //           >
// //             <QrCode className="w-4 h-4" />
// //             Scan
// //           </button>
          
// //           <button
// //             onClick={() => handleTabChange("profile")}
// //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //               activeTab === "profile"
// //                 ? "bg-green-600 text-white shadow-md"
// //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// //             }`}
// //           >
// //             <User className="w-4 h-4" />
// //             Profile
// //           </button>
          
// //           <button
// //             onClick={() => handleTabChange("excel")}
// //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //               activeTab === "excel"
// //                 ? "bg-green-600 text-white shadow-md"
// //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// //             }`}
// //           >
// //             <FileSpreadsheet className="w-4 h-4" />
// //             Excel
// //           </button>
          
// //           <button
// //             onClick={() => handleTabChange("stock-analytics")}
// //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //               activeTab === "stock-analytics"
// //                 ? "bg-green-600 text-white shadow-md"
// //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// //             }`}
// //           >
// //             <Package className="w-4 h-4" />
// //             Stock Analytics
// //           </button>
          
// //           <button
// //             onClick={() => handleTabChange("bulk")}
// //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //               activeTab === "bulk"
// //                 ? "bg-green-600 text-white shadow-md"
// //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// //             }`}
// //           >
// //             <Upload className="w-4 h-4" />
// //             CSV
// //           </button>
          
// //           <button
// //             onClick={() => handleTabChange("qrcodes")}
// //             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //               activeTab === "qrcodes"
// //                 ? "bg-green-600 text-white shadow-md"
// //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// //             }`}
// //           >
// //             <QrCode className="w-4 h-4" />
// //             QR Codes
// //           </button>
// //         </div>

// //         {/* ═══════════════════════════════════════════════════════════════ */}
// //         {/* ✅ NAVIGATION TABS - MOBILE DROPDOWN */}
// //         {/* ═══════════════════════════════════════════════════════════════ */}
// //         {mobileMenuOpen && (
// //           <div className="lg:hidden grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
// //             <button
// //               onClick={() => handleTabChange("tiles")}
// //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //                 activeTab === "tiles"
// //                   ? "bg-green-600 text-white shadow-md"
// //                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
// //               }`}
// //             >
// //               <Edit className="w-4 h-4" />
// //               Tiles
// //             </button>
            
// //             <button
// //               onClick={() => handleTabChange("customer-inquiries")}
// //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //                 activeTab === "customer-inquiries"
// //                   ? "bg-green-600 text-white shadow-md"
// //                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
// //               }`}
// //             >
// //               <Users className="w-4 h-4" />
// //               Customers
// //             </button>
            
// //             <button
// //               onClick={() => handleTabChange("worker")}
// //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //                 activeTab === "worker"
// //                   ? "bg-green-600 text-white shadow-md"
// //                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
// //               }`}
// //             >
// //               <User className="w-4 h-4" />
// //               Worker
// //             </button>
            
// //             {/* ✅ VIEW PLANS BUTTON - MOBILE */}
// //             <button
// //               onClick={() => {
// //                 setShowPlansModal(true);
// //                 setMobileMenuOpen(false);
// //               }}
// //               className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 text-sm font-medium shadow-md"
// //             >
// //               <Eye className="w-4 h-4" />
// //               Plans
// //             </button>
            
// //             <button
// //               onClick={() => window.open("/scan", "_blank")}
// //               className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700 text-sm font-medium shadow-md"
// //             >
// //               <QrCode className="w-4 h-4" />
// //               Scan
// //             </button>
            
// //             <button
// //               onClick={() => handleTabChange("profile")}
// //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //                 activeTab === "profile"
// //                   ? "bg-green-600 text-white shadow-md"
// //                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
// //               }`}
// //             >
// //               <User className="w-4 h-4" />
// //               Profile
// //             </button>
            
// //             <button
// //               onClick={() => handleTabChange("excel")}
// //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //                 activeTab === "excel"
// //                   ? "bg-green-600 text-white shadow-md"
// //                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
// //               }`}
// //             >
// //               <FileSpreadsheet className="w-4 h-4" />
// //               Excel
// //             </button>
            
// //             <button
// //               onClick={() => handleTabChange("stock-analytics")}
// //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //                 activeTab === "stock-analytics"
// //                   ? "bg-green-600 text-white shadow-md"
// //                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
// //               }`}
// //             >
// //               <Package className="w-4 h-4" />
// //               Stock
// //             </button>
            
// //             <button
// //               onClick={() => handleTabChange("bulk")}
// //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //                 activeTab === "bulk"
// //                   ? "bg-green-600 text-white shadow-md"
// //                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
// //               }`}
// //             >
// //               <Upload className="w-4 h-4" />
// //               CSV
// //             </button>
            
// //             <button
// //               onClick={() => handleTabChange("qrcodes")}
// //               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
// //                 activeTab === "qrcodes"
// //                   ? "bg-green-600 text-white shadow-md"
// //                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
// //               }`}
// //             >
// //               <QrCode className="w-4 h-4" />
// //               QR
// //             </button>
// //           </div>
// //         )}
// //       </div>

// //       {/* ═══════════════════════════════════════════════════════════════ */}
// //       {/* ✅ ALERT MESSAGES */}
// //       {/* ═══════════════════════════════════════════════════════════════ */}
      
// //       {error && (
// //         <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3 animate-shake">
// //           <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
// //           <div className="flex-1 min-w-0">
// //             <p className="text-red-800 font-medium text-sm sm:text-base">
// //               Error
// //             </p>
// //             <p className="text-red-700 text-xs sm:text-sm break-words">
// //               {error}
// //             </p>
// //           </div>
// //           <button
// //             onClick={() => setError(null)}
// //             className="text-red-400 hover:text-red-600 font-bold text-lg flex-shrink-0 transition-colors"
// //           >
// //             ×
// //           </button>
// //         </div>
// //       )}

// //       {success && (
// //         <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3 animate-slide-down">
// //           <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
// //           <div className="flex-1 min-w-0">
// //             <p className="text-green-800 font-medium text-sm sm:text-base">
// //               Success
// //             </p>
// //             <p className="text-green-700 text-xs sm:text-sm break-words">
// //               {success}
// //             </p>
// //           </div>
// //           <button
// //             onClick={() => setSuccess(null)}
// //             className="text-green-400 hover:text-green-600 font-bold text-lg flex-shrink-0 transition-colors"
// //           >
// //             ×
// //           </button>
// //         </div>
// //       )}

// //       {/* ═══════════════════════════════════════════════════════════════ */}
// //       {/* ✅ TILES TAB CONTENT */}
// //       {/* ═══════════════════════════════════════════════════════════════ */}
      
// //       {activeTab === "tiles" && (
// //         <>
// //           {/* Controls - Responsive */}
// //           <div className="flex flex-col gap-3 mb-4 sm:mb-6">
// //             {/* Search Bar */}
// //             <div className="relative">
// //               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //               <input
// //                 type="text"
// //                 placeholder="Search tiles by name, code, size, surface, material..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full text-sm sm:text-base transition-shadow"
// //               />
// //             </div>

// //             {/* Filters Row */}
// //             <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2">
// //               <select
// //                 value={categoryFilter}
// //                 onChange={(e) => setCategoryFilter(e.target.value)}
// //                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white cursor-pointer transition-shadow"
// //               >
// //                 <option value="all">All Categories</option>
// //                 <option value="floor">Floor Only</option>
// //                 <option value="wall">Wall Only</option>
// //                 <option value="both">Floor & Wall</option>
// //               </select>

// //               <select
// //                 value={stockFilter}
// //                 onChange={(e) => setStockFilter(e.target.value)}
// //                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white cursor-pointer transition-shadow"
// //               >
// //                 <option value="all">All Stock</option>
// //                 <option value="in-stock">In Stock</option>
// //                 <option value="out-of-stock">Out of Stock</option>
// //               </select>

// //               <button
// //                 onClick={loadData}
// //                 className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium"
// //                 title="Refresh Data"
// //               >
// //                 <RefreshCw className="w-4 h-4" />
// //                 <span className="hidden sm:inline">Refresh</span>
// //               </button>

// //               <button
// //                 onClick={() => {
// //                   setIsAddingTile(true);
// //                   setEditingTile(null);
// //                   resetNewTile();
// //                   window.scrollTo({ top: 0, behavior: 'smooth' });
// //                 }}
// //                 className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
// //               >
// //                 <Plus className="w-4 h-4" />
// //                 Add New Tile
// //               </button>
// //             </div>

// //             {/* Results Summary with Pagination Info */}
// //             <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center justify-between gap-2">
// //               <div>
// //                 Showing {currentTiles.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
// //                 {searchTerm && (
// //                   <span className="font-medium"> matching "{searchTerm}"</span>
// //                 )}
// //               </div>
// //               {totalPages > 1 && (
// //                 <div className="text-gray-500">
// //                   Page {currentPage} of {totalPages}
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Add/Edit Tile Form - Responsive */}
// //           {(isAddingTile || editingTile) && (
// //             <div className="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6 border-2 border-dashed border-green-300 rounded-xl bg-green-50">
// //               <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
// //                 {editingTile ? (
// //                   <>
// //                     <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
// //                     <span className="truncate">Edit: {editingTile.name}</span>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
// //                     Add New Tile
// //                   </>
// //                 )}
// //               </h3>

// //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
// //                 {/* Tile Name */}
// //                 <div className="space-y-2">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// //                     Tile Name *
// //                   </label>
// //                   <input
// //                     type="text"
// //                     placeholder="Enter tile name"
// //                     value={newTile.name}
// //                     onChange={(e) =>
// //                       setNewTile({ ...newTile, name: e.target.value })
// //                     }
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
// //                   />
// //                 </div>

// //                 {/* Tile Code */}
// //                 <div className="space-y-2">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// //                     Tile Code
// //                   </label>
// //                   <input
// //                     type="text"
// //                     placeholder="Auto-generated if empty"
// //                     value={newTile.tileCode}
// //                     onChange={(e) =>
// //                       setNewTile({ ...newTile, tileCode: e.target.value })
// //                     }
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
// //                   />
// //                 </div>

// //                 {/* Category */}
// //                 <div className="space-y-2">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// //                     Category *
// //                   </label>
// //                   <select
// //                     value={newTile.category}
// //                     onChange={(e) =>
// //                       setNewTile({
// //                         ...newTile,
// //                         category: e.target.value as any,
// //                       })
// //                     }
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white cursor-pointer transition-shadow"
// //                   >
// //                     <option value="floor">Floor Only</option>
// //                     <option value="wall">Wall Only</option>
// //                     <option value="both">Floor & Wall</option>
// //                   </select>
// //                 </div>

// //                 {/* Size */}
// //                 <div className="space-y-2">
// //                   <label
// //                     htmlFor="tile-size-select"
// //                     className="block text-xs sm:text-sm font-medium text-gray-700"
// //                   >
// //                     Size *
// //                   </label>
// //                   <div className="relative">
// //                     <select
// //                       id="tile-size-select"
// //                       name="size"
// //                       value={newTile.size}
// //                       onChange={(e) => {
// //                         console.log("Size selected:", e.target.value);
// //                         setNewTile({ ...newTile, size: e.target.value });
// //                       }}
// //                       onFocus={(e) => {
// //                         e.target.click();
// //                       }}
// //                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
// //                       style={{
// //                         WebkitAppearance: "none",
// //                         MozAppearance: "none",
// //                         touchAction: "manipulation",
// //                       }}
// //                     >
// //                       <option value="">Select Tile Size</option>
// //                       <option value="30x30 cm">30x30 cm</option>
// //                       <option value="30x60 cm">30x60 cm</option>
// //                       <option value="60x60 cm">60x60 cm</option>
// //                       <option value="60x120 cm">60x120 cm</option>
// //                       <option value="80x80 cm">80x80 cm</option>
// //                       <option value="40x40 cm">40x40 cm</option>
// //                       <option value="40x60 cm">40x60 cm</option>
// //                       <option value="50x50 cm">50x50 cm</option>
// //                       <option value="20x120 cm">20x120 cm</option>
// //                       <option value="15x90 cm">15x90 cm</option>
// //                       <option value="10x30 cm">10x30 cm</option>
// //                       <option value="20x20 cm">20x20 cm</option>
// //                       <option value="25x40 cm">25x40 cm</option>
// //                       <option value="61x122 cm">61x122 cm</option>
// //                       <option value="122x122 cm">122x122 cm</option>
// //                       <option value="75x75 cm">75x75 cm</option>
// //                       <option value="100x100 cm">100x100 cm</option>
// //                       <option value="45x45 cm">45x45 cm</option>
// //                       <option value="7.5x15 cm">7.5x15 cm</option>
// //                       <option value="6x25 cm">6x25 cm</option>
// //                     </select>

// //                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
// //                       <ChevronDown className="w-4 h-4 text-gray-400" />
// //                     </div>
// //                   </div>

// //                   {newTile.size && (
// //                     <div className="flex items-center gap-2 text-xs text-green-600">
// //                       <CheckCircle className="w-3 h-3" />
// //                       <span>Selected: {newTile.size}</span>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Tile Surface */}
// //                 <div className="space-y-2">
// //                   <label
// //                     htmlFor="tile-surface-select"
// //                     className="block text-xs sm:text-sm font-medium text-gray-700"
// //                   >
// //                     Tile Surface
// //                   </label>
// //                   <div className="relative">
// //                     <select
// //                       id="tile-surface-select"
// //                       name="tileSurface"
// //                       value={newTile.tileSurface || ""}
// //                       onChange={(e) => {
// //                         console.log("Surface selected:", e.target.value);
// //                         setNewTile({
// //                           ...newTile,
// //                           tileSurface: e.target.value || undefined,
// //                         });
// //                       }}
// //                       onFocus={(e) => {
// //                         e.target.click();
// //                       }}
// //                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
// //                       style={{
// //                         WebkitAppearance: "none",
// //                         MozAppearance: "none",
// //                         touchAction: "manipulation",
// //                       }}
// //                     >
// //                       <option value="">Select Surface Finish</option>
// //                       <option value="Polished">Polished</option>
// //                       <option value="Step Side">Step Side</option>
// //                       <option value="Matt">Matt</option>
// //                       <option value="Carving">Carving</option>
// //                       <option value="High Gloss">High Gloss</option>
// //                       <option value="Metallic">Metallic</option>
// //                       <option value="Sugar">Sugar</option>
// //                       <option value="Glue">Glue</option>
// //                       <option value="Punch">Punch</option>
// //                     </select>

// //                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
// //                       <ChevronDown className="w-4 h-4 text-gray-400" />
// //                     </div>
// //                   </div>

// //                   {newTile.tileSurface && (
// //                     <div className="flex items-center gap-2 text-xs text-green-600">
// //                       <CheckCircle className="w-3 h-3" />
// //                       <span>Selected: {newTile.tileSurface}</span>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Tile Material */}
// //                 <div className="space-y-2">
// //                   <label
// //                     htmlFor="tile-material-select"
// //                     className="block text-xs sm:text-sm font-medium text-gray-700"
// //                   >
// //                     Tile Material
// //                   </label>
// //                   <div className="relative">
// //                     <select
// //                       id="tile-material-select"
// //                       name="tileMaterial"
// //                       value={newTile.tileMaterial || ""}
// //                       onChange={(e) => {
// //                         console.log("Material selected:", e.target.value);
// //                         setNewTile({
// //                           ...newTile,
// //                           tileMaterial: e.target.value || undefined,
// //                         });
// //                       }}
// //                       onFocus={(e) => {
// //                         e.target.click();
// //                       }}
// //                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
// //                       style={{
// //                         WebkitAppearance: "none",
// //                         MozAppearance: "none",
// //                         touchAction: "manipulation",
// //                       }}
// //                     >
// //                       <option value="">Select Material Type</option>
// //                       <option value="Slabs">Slabs</option>
// //                       <option value="GVT & PGVT">GVT & PGVT</option>
// //                       <option value="Double Charge">Double Charge</option>
// //                       <option value="Counter Tops">Counter Tops</option>
// //                       <option value="Full Body">Full Body</option>
// //                       <option value="Ceramic">Ceramic</option>
// //                       <option value="Mosaic">Mosaic</option>
// //                       <option value="Subway">Subway</option>
// //                     </select>

// //                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
// //                       <ChevronDown className="w-4 h-4 text-gray-400" />
// //                     </div>
// //                   </div>

// //                   {newTile.tileMaterial && (
// //                     <div className="flex items-center gap-2 text-xs text-green-600">
// //                       <CheckCircle className="w-3 h-3" />
// //                       <span>Selected: {newTile.tileMaterial}</span>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Price */}
// //                 <div className="space-y-2">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// //                     Price (₹) *
// //                   </label>
// //                   <input
// //                     type="number"
// //                     placeholder="Enter price"
// //                     value={newTile.price || ""}
// //                     onChange={(e) =>
// //                       setNewTile({
// //                         ...newTile,
// //                         price:
// //                           e.target.value === "" ? 0 : Number(e.target.value),
// //                       })
// //                     }
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
// //                     min="0"
// //                     step="0.01"
// //                   />
// //                 </div>

// //                 {/* Stock */}
// //                 <div className="space-y-2">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// //                     Stock Quantity *
// //                   </label>
// //                   <input
// //                     type="number"
// //                     placeholder="Enter stock quantity"
// //                     value={newTile.stock || ""}
// //                     onChange={(e) =>
// //                       setNewTile({
// //                         ...newTile,
// //                         stock:
// //                           e.target.value === "" ? 0 : Number(e.target.value),
// //                       })
// //                     }
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
// //                     min="0"
// //                   />
// //                 </div>

// //                 {/* Main Image Upload */}
// //                 <div className="space-y-2">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// //                     Tile Image *
// //                   </label>
// //                   <div className="flex flex-col gap-2">
// //                     <input
// //                       type="file"
// //                       accept="image/*"
// //                       onChange={(e) => {
// //                         const file = e.target.files?.[0];
// //                         if (file) handleImageUpload(file, "image");
// //                       }}
// //                       className="hidden"
// //                       id="tile-image-upload"
// //                     />
// //                     <label
// //                       htmlFor="tile-image-upload"
// //                       className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium ${
// //                         imageUploading ? "opacity-50 cursor-not-allowed" : ""
// //                       }`}
// //                     >
// //                       {imageUploading ? (
// //                         <>
// //                           <Loader className="w-4 h-4 animate-spin" />
// //                           Uploading...
// //                         </>
// //                       ) : (
// //                         <>
// //                           <Upload className="w-4 h-4" />
// //                           Choose Image
// //                         </>
// //                       )}
// //                     </label>
// //                     {newTile.imageUrl && (
// //                       <div className="flex items-center gap-2">
// //                         <img
// //                           src={newTile.imageUrl}
// //                           alt="Preview"
// //                           className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
// //                         />
// //                         <div className="flex items-center gap-1 text-green-600">
// //                           <CheckCircle className="w-4 h-4" />
// //                           <span className="text-xs font-medium">Uploaded</span>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>

// //                 {/* Texture Image Upload */}
// //                 <div className="space-y-2">
// //                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
// //                     Texture (Optional)
// //                   </label>
// //                   <div className="flex flex-col gap-2">
// //                     <input
// //                       type="file"
// //                       accept="image/*"
// //                       onChange={(e) => {
// //                         const file = e.target.files?.[0];
// //                         if (file) handleImageUpload(file, "texture");
// //                       }}
// //                       className="hidden"
// //                       id="texture-image-upload"
// //                     />
// //                     <label
// //                       htmlFor="texture-image-upload"
// //                       className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium ${
// //                         textureUploading ? "opacity-50 cursor-not-allowed" : ""
// //                       }`}
// //                     >
// //                       {textureUploading ? (
// //                         <>
// //                           <Loader className="w-4 h-4 animate-spin" />
// //                           Uploading...
// //                         </>
// //                       ) : (
// //                         <>
// //                           <Upload className="w-4 h-4" />
// //                           Choose Texture
// //                         </>
// //                       )}
// //                     </label>
// //                     {newTile.textureUrl && (
// //                       <div className="flex items-center gap-2">
// //                         <img
// //                           src={newTile.textureUrl}
// //                           alt="Texture"
// //                           className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
// //                         />
// //                         <div className="flex items-center gap-1 text-green-600">
// //                           <CheckCircle className="w-4 h-4" />
// //                           <span className="text-xs font-medium">Uploaded</span>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Form Actions */}
// //               <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6">
// //                 <button
// //                   onClick={editingTile ? handleUpdateTile : handleAddTile}
// //                   disabled={imageUploading || textureUploading}
// //                   className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
// //                 >
// //                   <Save className="w-4 h-4" />
// //                   {editingTile ? "Update Tile" : "Save Tile"}
// //                 </button>
// //                 <button
// //                   onClick={() => {
// //                     setIsAddingTile(false);
// //                     setEditingTile(null);
// //                     resetNewTile();
// //                     setError(null);
// //                   }}
// //                   className="px-4 sm:px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base font-medium"
// //                 >
// //                   Cancel
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {/* Desktop Table View */}
// //           <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
// //             <table className="w-full border-collapse bg-white">
// //               <thead>
// //                 <tr className="bg-gray-50 border-b border-gray-200">
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Image</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Name</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Code</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Category</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Size</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Surface</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Material</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Price</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Stock</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Status</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">QR</th>
// //                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Actions</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {currentTiles.length === 0 ? (
// //                   <tr>
// //                     <td colSpan={12} className="text-center p-8 text-gray-500">
// //                       {tiles.length === 0 ? (
// //                         <div className="space-y-2">
// //                           <Package className="w-12 h-12 text-gray-300 mx-auto" />
// //                           <p className="font-medium">No tiles found</p>
// //                           <p className="text-sm">Start by adding your first tile!</p>
// //                         </div>
// //                       ) : (
// //                         <div className="space-y-2">
// //                           <Search className="w-12 h-12 text-gray-300 mx-auto" />
// //                           <p className="font-medium">No tiles match your search</p>
// //                           <p className="text-sm">Try adjusting your search or filters</p>
// //                         </div>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   currentTiles.map((tile) => (
// //                     <tr
// //                       key={tile.id}
// //                       className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
// //                     >
// //                       <td className="p-3">
// //                         <img
// //                           src={tile.imageUrl}
// //                           alt={tile.name}
// //                           className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
// //                           onError={(e) => {
// //                             (e.target as HTMLImageElement).src = "/placeholder-tile.png";
// //                           }}
// //                         />
// //                       </td>
// //                       <td className="p-3">
// //                         <div>
// //                           <div className="font-medium text-gray-900 text-sm">{tile.name}</div>
// //                           {tile.textureUrl && (
// //                             <div className="text-xs text-green-600">Has texture</div>
// //                           )}
// //                         </div>
// //                       </td>
// //                       <td className="p-3 text-xs text-gray-600 font-mono">{tile.tileCode}</td>
// //                       <td className="p-3">
// //                         <span
// //                           className={`px-2 py-1 rounded-full text-xs font-medium ${
// //                             tile.category === "floor"
// //                               ? "bg-blue-100 text-blue-800"
// //                               : tile.category === "wall"
// //                               ? "bg-purple-100 text-purple-800"
// //                               : "bg-gray-100 text-gray-800"
// //                           }`}
// //                         >
// //                           {tile.category === "both"
// //                             ? "Both"
// //                             : tile.category.charAt(0).toUpperCase() + tile.category.slice(1)}
// //                         </span>
// //                       </td>
// //                       <td className="p-3 text-gray-600 text-sm">{tile.size}</td>
// //                       <td className="p-3 text-xs sm:text-sm">
// //                         {tile.tileSurface ? (
// //                           <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
// //                             <span>🔘</span>
// //                             <span>{tile.tileSurface}</span>
// //                           </span>
// //                         ) : (
// //                           <span className="text-gray-400 text-xs">—</span>
// //                         )}
// //                       </td>
// //                       <td className="p-3 text-xs sm:text-sm">
// //                         {tile.tileMaterial ? (
// //                           <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
// //                             <span>🧱</span>
// //                             <span>{tile.tileMaterial}</span>
// //                           </span>
// //                         ) : (
// //                           <span className="text-gray-400 text-xs">—</span>
// //                         )}
// //                       </td>
// //                       <td className="p-3 font-semibold text-gray-900 text-sm">
// //                         ₹{tile.price.toLocaleString()}
// //                       </td>
// //                       <td className="p-3">
// //                         <div className="text-sm">
// //                           <div className="font-medium">{tile.stock || 0}</div>
// //                           {(tile.stock || 0) < 10 && tile.inStock && (
// //                             <div className="text-xs text-orange-600">Low</div>
// //                           )}
// //                         </div>
// //                       </td>
// //                       <td className="p-3">
// //                         <span
// //                           className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(tile)}`}
// //                         >
// //                           {getStockStatusText(tile)}
// //                         </span>
// //                       </td>
// //                       <td className="p-3">
// //                         <span
// //                           className={`px-2 py-1 rounded-full text-xs font-medium ${
// //                             tile.qrCode
// //                               ? "bg-green-100 text-green-800"
// //                               : "bg-orange-100 text-orange-800"
// //                           }`}
// //                         >
// //                           {tile.qrCode ? "✓" : "○"}
// //                         </span>
// //                       </td>
// //                       <td className="p-3">
// //                         <div className="flex gap-2">
// //                           <button
// //                             onClick={() => handleEditTile(tile)}
// //                             className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
// //                             title="Edit"
// //                           >
// //                             <Edit className="w-4 h-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleDeleteTile(tile.id, tile.name)}
// //                             className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
// //                             title="Delete"
// //                           >
// //                             <Trash2 className="w-4 h-4" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Mobile/Tablet Card View */}
// //           <div className="lg:hidden space-y-3">
// //             {currentTiles.length === 0 ? (
// //               <div className="text-center py-12 text-gray-500">
// //                 {tiles.length === 0 ? (
// //                   <div className="space-y-2">
// //                     <Package className="w-16 h-16 text-gray-300 mx-auto" />
// //                     <p className="font-medium">No tiles found</p>
// //                     <p className="text-sm">Start by adding your first tile!</p>
// //                   </div>
// //                 ) : (
// //                   <div className="space-y-2">
// //                     <Search className="w-16 h-16 text-gray-300 mx-auto" />
// //                     <p className="font-medium">No tiles match your search</p>
// //                     <p className="text-sm">Try adjusting your search or filters</p>
// //                   </div>
// //                 )}
// //               </div>
// //             ) : (
// //               currentTiles.map((tile) => (
// //                 <div
// //                   key={tile.id}
// //                   className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
// //                 >
// //                   <div className="flex gap-3">
// //                     {/* Image */}
// //                     <div className="flex-shrink-0">
// //                       <img
// //                         src={tile.imageUrl}
// //                         alt={tile.name}
// //                         className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
// //                         onError={(e) => {
// //                           (e.target as HTMLImageElement).src = "/placeholder-tile.png";
// //                         }}
// //                       />
// //                     </div>

// //                     {/* Details */}
// //                     <div className="flex-1 min-w-0">
// //                       {/* Title Row */}
// //                       <div className="flex items-start justify-between gap-2 mb-2">
// //                         <div className="min-w-0 flex-1">
// //                           <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
// //                             {tile.name}
// //                           </h3>
// //                           <p className="text-xs text-gray-500 font-mono">{tile.tileCode}</p>
// //                         </div>
// //                         <div className="flex gap-1 flex-shrink-0">
// //                           <button
// //                             onClick={() => handleEditTile(tile)}
// //                             className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
// //                           >
// //                             <Edit className="w-4 h-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleDeleteTile(tile.id, tile.name)}
// //                             className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
// //                           >
// //                             <Trash2 className="w-4 h-4" />
// //                           </button>
// //                         </div>
// //                       </div>

// //                       {/* Info Grid */}
// //                       <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
// //                         <div>
// //                           <span className="text-gray-500">Category:</span>
// //                           <div className="mt-0.5">
// //                             <span
// //                               className={`px-2 py-0.5 rounded-full text-xs font-medium ${
// //                                 tile.category === "floor"
// //                                   ? "bg-blue-100 text-blue-800"
// //                                   : tile.category === "wall"
// //                                   ? "bg-purple-100 text-purple-800"
// //                                   : "bg-gray-100 text-gray-800"
// //                               }`}
// //                             >
// //                               {tile.category === "both" ? "Both" : tile.category}
// //                             </span>
// //                           </div>
// //                         </div>
// //                         <div>
// //                           <span className="text-gray-500">Size:</span>
// //                           <div className="font-medium text-gray-900">{tile.size}</div>
// //                         </div>
// //                         <div>
// //                           <span className="text-gray-500">Price:</span>
// //                           <div className="font-semibold text-gray-900">
// //                             ₹{tile.price.toLocaleString()}
// //                           </div>
// //                         </div>
// //                         <div>
// //                           <span className="text-gray-500">Stock:</span>
// //                           <div className="font-medium text-gray-900">
// //                             {tile.stock || 0}
// //                             {(tile.stock || 0) < 10 && tile.inStock && (
// //                               <span className="text-orange-600 ml-1">(Low)</span>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </div>

// //                       {/* Surface & Material Accordion */}
// //                       {(tile.tileSurface || tile.tileMaterial) && (
// //                         <div className="mt-3 border-t border-gray-200 pt-3">
// //                           <button
// //                             onClick={() =>
// //                               setExpandedTileId(expandedTileId === tile.id ? null : tile.id)
// //                             }
// //                             className="w-full flex items-center justify-between text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
// //                           >
// //                             <span className="flex items-center gap-1.5">
// //                               <Package className="w-3.5 h-3.5" />
// //                               Tile Specifications
// //                             </span>
// //                             {expandedTileId === tile.id ? (
// //                               <ChevronUp className="w-4 h-4 text-gray-500" />
// //                             ) : (
// //                               <ChevronDown className="w-4 h-4 text-gray-500" />
// //                             )}
// //                           </button>

// //                           {expandedTileId === tile.id && (
// //                             <div className="mt-2 space-y-2 animate-slide-down">
// //                               {tile.tileSurface && (
// //                                 <div className="flex items-center justify-between text-xs">
// //                                   <span className="text-gray-600 flex items-center gap-1">
// //                                     <span>🔘</span>
// //                                     Surface:
// //                                   </span>
// //                                   <span className="font-medium text-gray-900 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
// //                                     {tile.tileSurface}
// //                                   </span>
// //                                 </div>
// //                               )}
// //                               {tile.tileMaterial && (
// //                                 <div className="flex items-center justify-between text-xs">
// //                                   <span className="text-gray-600 flex items-center gap-1">
// //                                     <span>🧱</span>
// //                                     Material:
// //                                   </span>
// //                                   <span className="font-medium text-gray-900 bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
// //                                     {tile.tileMaterial}
// //                                   </span>
// //                                 </div>
// //                               )}
// //                             </div>
// //                           )}
// //                         </div>
// //                       )}

// //                       {/* Status Row */}
// //                       <div className="flex items-center gap-2 mt-2 flex-wrap">
// //                         <span
// //                           className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(tile)}`}
// //                         >
// //                           {getStockStatusText(tile)}
// //                         </span>
// //                         <span
// //                           className={`px-2 py-1 rounded-full text-xs font-medium ${
// //                             tile.qrCode
// //                               ? "bg-green-100 text-green-800"
// //                               : "bg-orange-100 text-orange-800"
// //                           }`}
// //                         >
// //                           QR: {tile.qrCode ? "Yes" : "No"}
// //                         </span>
// //                         {tile.textureUrl && (
// //                           <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
// //                             Has Texture
// //                           </span>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))
// //             )}
// //           </div>

// //           {/* PAGINATION COMPONENT - RESPONSIVE */}
// //           {totalPages > 1 && (
// //             <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4">
// //               {/* Page Info - Mobile */}
// //               <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
// //                 Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
// //               </div>

// //               {/* Pagination Controls */}
// //               <div className="flex items-center gap-2 order-1 sm:order-2">
// //                 {/* Previous Button */}
// //                 <button
// //                   onClick={goToPreviousPage}
// //                   disabled={currentPage === 1}
// //                   className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
// //                     currentPage === 1
// //                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
// //                       : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
// //                   }`}
// //                 >
// //                   <ChevronLeft className="w-4 h-4" />
// //                   <span className="hidden sm:inline">Previous</span>
// //                 </button>

// //                 {/* Page Numbers */}
// //                 <div className="flex items-center gap-1">
// //                   {getPageNumbers().map((page, index) => {
// //                     if (page === '...') {
// //                       return (
// //                         <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
// //                           ...
// //                         </span>
// //                       );
// //                     }
// //                     return (
// //                       <button
// //                         key={page}
// //                         onClick={() => goToPage(page as number)}
// //                         className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all ${
// //                           currentPage === page
// //                             ? "bg-green-600 text-white shadow-md"
// //                             : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
// //                         }`}
// //                       >
// //                         {page}
// //                       </button>
// //                     );
// //                   })}
// //                 </div>

// //                 {/* Next Button */}
// //                 <button
// //                   onClick={goToNextPage}
// //                   disabled={currentPage === totalPages}
// //                   className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
// //                     currentPage === totalPages
// //                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
// //                       : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
// //                   }`}
// //                 >
// //                   <span className="hidden sm:inline">Next</span>
// //                   <ChevronRight className="w-4 h-4" />
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </>
// //       )}

// //       {/* ═══════════════════════════════════════════════════════════════ */}
// //       {/* ✅ OTHER TABS - WRAPPED FOR RESPONSIVENESS */}
// //       {/* ═══════════════════════════════════════════════════════════════ */}
      
// //       <div className="overflow-hidden">
// //         {activeTab === "worker" && <WorkerManagement />}
// //         {activeTab === "profile" && <SellerProfile />}
// //         {activeTab === "excel" && <ExcelUpload onUploadComplete={loadData} />}
// //         {activeTab === "stock-analytics" && <SellerStockAnalytics />}
// //         {activeTab === "bulk" && <BulkUpload onUploadComplete={loadData} />}
// //         {activeTab === "customer-inquiries" && <CustomerInquiriesManager />}
// //         {activeTab === "qrcodes" && (
// //           <QRCodeManager tiles={tiles} sellerId={currentUser?.user_id} onQRCodeGenerated={loadData} />
// //         )}
// //         {activeTab === "analytics" && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
// //       </div>

// //       {/* ═══════════════════════════════════════════════════════════════ */}
// //       {/* ✅ PAYMENT MODALS (RAZORPAY) */}
// //       {/* ═══════════════════════════════════════════════════════════════ */}

// //       {/* Plans Modal */}
// //       <PlansModal
// //         isOpen={showPlansModal}
// //         onClose={() => setShowPlansModal(false)}
// //         isLoggedIn={isAuthenticated}
// //         onSelectPlan={handlePlanSelection}
// //       />

// //       {/* Payment Confirmation Modal */}
// //       <PaymentConfirmationModal
// //         isOpen={showPaymentConfirmation}
// //         onClose={() => {
// //           setShowPaymentConfirmation(false);
// //           setSelectedPlan(null);
// //         }}
// //         plan={selectedPlan}
// //         onConfirm={handlePaymentConfirm}
// //         isProcessing={processingPayment}
// //       />

// //       {/* Payment Checkout - Show when checkout options are ready */}
// //       {checkoutOptions && paymentId && selectedPlan && (
// //         <PaymentCheckout
// //           checkoutOptions={checkoutOptions}
// //           paymentId={paymentId}
// //           planId={selectedPlan.id}
// //           sellerId={currentUser?.user_id || ''} 
// //           onError={handlePaymentError}
// //         />
// //       )}
// //     </div>
// //   );
// // }; 
// import React, { useState, useEffect } from "react";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Upload,
//   Save,
//   Store,
//   Package,
//   FileSpreadsheet,
//   AlertCircle,
//   CheckCircle,
//   Loader,
//   Search,
//   Filter,
//   Users,
//   RefreshCw,
//   ChevronUp,
//   ChevronDown,
//   Eye,
//   TrendingUp,
//   QrCode,
//   Download,
//   User,
//   Menu,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   Shield,
// } from "lucide-react";
// import { Tile } from "../types";
// import { useAppStore } from "../stores/appStore";
// import { BulkUpload } from "./BulkUpload";
// import { AnalyticsDashboard } from "./AnalyticsDashboard";
// import { QRCodeManager } from "./QRCodeManager";
// import { ExcelUpload } from "./ExcelUpload";
// import { generateTileQRCode } from "../utils/qrCodeUtils";
// import { SellerProfile } from "./SellerProfile";
// import { WorkerManagement } from "./WorkerManagement";
// import { SellerStockAnalytics } from "./SellerStockAnalytics";
// import { CustomerInquiriesManager } from './CustomerInquiriesManager';
// import { PlanStatusBanner } from './PlanStatusBanner';

// // Payment System Imports
// import { PlansModal } from './Payment/PlansModal';
// import { PaymentConfirmationModal } from './Payment/PaymentConfirmationModal';
// import { PaymentCheckout } from './Payment/PaymentCheckout';
// import { initiatePayment } from '../lib/paymentService';
// import { getPlanById } from '../lib/planService';
// import type { Plan } from '../types/plan.types';
// import type { RazorpayCheckoutOptions } from '../types/payment.types';
// import { auth } from '../lib/firebase';

// import {
//   uploadTile,
//   updateTile,
//   deleteTile,
//   getSellerProfile,
//   getSellerTiles,
//   updateTileQRCode,
//   getTileById,
// } from "../lib/firebaseutils";

// import { uploadToCloudinary } from "../utils/cloudinaryUtils";

// // ✅✅✅ NEW: Firestore imports for plan checking
// import { db } from '../lib/firebase';
// import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
// import { 
//   getSellerSubscription, 
//   isSubscriptionExpired,
//   getDaysUntilExpiry 
// } from "../lib/subscriptionService"
// // ═══════════════════════════════════════════════════════════════
// // ✅ PLAN STATUS INTERFACE
// // ═══════════════════════════════════════════════════════════════

// interface SellerPlanStatus {
//   isActive: boolean;
//   expiresAt: Date | null;
//   planName: string | null;
//   planId: string | null;
//   daysRemaining: number;
//   loading: boolean;
//   lastChecked: Date | null;
// }

// // ═══════════════════════════════════════════════════════════════
// // ✅ MAIN SELLER DASHBOARD COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const SellerDashboard: React.FC = () => {
//   const { currentUser, isAuthenticated } = useAppStore();
  
//   // Tab Management
//   const [isAddingTile, setIsAddingTile] = useState(false);
//   const [activeTab, setActiveTab] = useState<
//     | "tiles"
//     | "bulk"
//     | "excel"
//     | "analytics"
//     | "qrcodes"
//     | "profile"
//     | "worker"
//     | "scan"
//     | "stock-analytics"
//     | "customer-inquiries"
//   >("tiles");

//   // Tile Management
//   const [editingTile, setEditingTile] = useState<Tile | null>(null);
//   const [sellerProfile, setSellerProfile] = useState<any>(null);
//   const [tiles, setTiles] = useState<Tile[]>([]);
//   const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
//   const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0);
  
//   // UI State
//   const [loading, setLoading] = useState(true);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [textureUploading, setTextureUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
  
//   // Filter State
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState<string>("all");
//   const [stockFilter, setStockFilter] = useState<string>("all");
  
//   // Mobile UI
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [expandedTileId, setExpandedTileId] = useState<string | null>(null);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // Payment State
//   const [showPlansModal, setShowPlansModal] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
//   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
//   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   // ✅ NEW: PLAN STATUS STATE
//   const [planStatus, setPlanStatus] = useState<SellerPlanStatus>({
//     isActive: false,
//     expiresAt: null,
//     planName: null,
//     planId: null,
//     daysRemaining: 0,
//     loading: true,
//     lastChecked: null
//   });

//   // New Tile Form State
//   const [newTile, setNewTile] = useState<Partial<Tile>>({
//     name: "",
//     category: "both",
//     size: "",
//     price: undefined,
//     stock: 0,
//     inStock: true,
//     imageUrl: "",
//     textureUrl: "",
//     tileCode: "",
//     tileSurface: "",
//     tileMaterial: "",
//   });

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ CHECK SELLER PLAN STATUS FROM FIRESTORE
//   // ═══════════════════════════════════════════════════════════════
// // ═══════════════════════════════════════════════════════════════
// // ✅ PAYMENT SUCCESS HANDLER - CRITICAL FOR PLAN REFRESH
// // ═══════════════════════════════════════════════════════════════
// // const handlePaymentSuccess = async () => {
// //   console.log('═══════════════════════════════════════════════════════');
// //   console.log('🎉 PAYMENT SUCCESS - Starting dashboard refresh sequence');
// //   console.log('═══════════════════════════════════════════════════════');
  
// //   try {
// //     // Step 1: Close all payment modals immediately
// //     console.log('🔄 Step 1/6: Closing payment modals...');
// //     setCheckoutOptions(null);
// //     setPaymentId(null);
// //     setProcessingPayment(false);
// //     setSelectedPlan(null);
// //     setShowPaymentConfirmation(false);
// //     setShowPlansModal(false);
// //     console.log('✅ Payment modals closed');
    
// //     // Step 2: Show initial success message
// //     console.log('🔄 Step 2/6: Showing success message...');
// //     setSuccess('🎉 Payment successful! Activating your plan...');
// //     console.log('✅ Success message displayed');
    
// //     // Step 3: Force increment plan refresh trigger
// //     console.log('🔄 Step 3/6: Incrementing plan refresh trigger...');
// //     setPlanRefreshTrigger(prev => {
// //       const newValue = prev + 1;
// //       console.log(`📊 planRefreshTrigger: ${prev} → ${newValue}`);
// //       return newValue;
// //     });
// //     console.log('✅ Refresh trigger incremented');
    
// //     // Step 4: Wait for Firestore write to complete
// //     console.log('🔄 Step 4/6: Waiting for Firestore sync (1.5s)...');
// //     await new Promise(resolve => setTimeout(resolve, 1500));
// //     console.log('✅ Firestore sync wait complete');
    
// //     // Step 5: Reload plan status
// //     console.log('🔄 Step 5/6: Reloading plan status...');
// //     await loadPlanStatus();
// //     console.log('✅ Plan status reloaded');
    
// //     // Step 6: Reload all dashboard data
// //     console.log('🔄 Step 6/6: Reloading dashboard data...');
// //     await loadData();
// //     console.log('✅ Dashboard data reloaded');
    
// //     // Final success message
// //     console.log('🎉 Dashboard refresh sequence COMPLETE!');
// //     setSuccess('✅ Plan activated successfully! All features are now unlocked.');
    
// //     // Verify plan status
// //     console.log('🔍 Verifying plan status after refresh:');
// //     console.log('  - Is Active:', planStatus.isActive);
// //     console.log('  - Plan Name:', planStatus.planName);
// //     console.log('  - Days Remaining:', planStatus.daysRemaining);
// //     console.log('  - Expires At:', planStatus.expiresAt?.toLocaleString());
    
// //     // Clear success message after 5 seconds
// //     setTimeout(() => {
// //       console.log('🧹 Clearing success message');
// //       setSuccess(null);
// //     }, 5000);
    
// //     console.log('═══════════════════════════════════════════════════════');
// //     console.log('✅ PAYMENT SUCCESS HANDLER COMPLETED SUCCESSFULLY');
// //     console.log('═══════════════════════════════════════════════════════');
    
// //   } catch (error: any) {
// //     console.error('═══════════════════════════════════════════════════════');
// //     console.error('❌ ERROR in handlePaymentSuccess:', error);
// //     console.error('═══════════════════════════════════════════════════════');
// //     setError('Payment successful but dashboard refresh failed. Please reload the page manually.');
// //   }
// // }; 
// // const handlePaymentSuccess = async () => {
// //   console.log('═══════════════════════════════════════════════════════');
// //   console.log('🎉 PAYMENT SUCCESS - Starting dashboard refresh sequence');
// //   console.log('═══════════════════════════════════════════════════════');
  
// //   try {
// //     // Step 1: Close all payment modals
// //     console.log('🔄 Step 1/7: Closing payment modals...');
// //     setCheckoutOptions(null);
// //     setPaymentId(null);
// //     setProcessingPayment(false);
// //     setSelectedPlan(null);
// //     setShowPaymentConfirmation(false);
// //     setShowPlansModal(false);
// //     console.log('✅ Payment modals closed');
    
// //     // Step 2: Show initial success message
// //     console.log('🔄 Step 2/7: Showing success message...');
// //     setSuccess('🎉 Payment successful! Activating your plan and enabling features...');
// //     console.log('✅ Success message displayed');
    
// //     // Step 3: Force increment plan refresh trigger
// //     console.log('🔄 Step 3/7: Incrementing plan refresh trigger...');
// //     setPlanRefreshTrigger(prev => prev + 1);
// //     console.log('✅ Refresh trigger incremented');
    
// //     // ✅✅✅ NEW STEP 4: Enable all workers ✅✅✅
// //     console.log('🔄 Step 4/7: Enabling all worker accounts...');
// //     try {
// //       const { enableAllSellersWorkers } = await import('../lib/firebaseutils');
// //       const result = await enableAllSellersWorkers(currentUser?.user_id || '');
      
// //       if (result.success && result.count > 0) {
// //         console.log(`✅ Enabled ${result.count} worker account(s)`);
// //         setSuccess(`🎉 Plan activated! ${result.count} worker account(s) re-enabled.`);
// //       } else {
// //         console.log('ℹ️ No workers to enable');
// //       }
// //     } catch (workerError: any) {
// //       console.warn('⚠️ Could not enable workers:', workerError);
// //       // Don't fail the whole process
// //     }
// //     console.log('✅ Worker enablement complete');
    
// //     // Step 5: Wait for Firestore sync
// //     console.log('🔄 Step 5/7: Waiting for Firestore sync (1.5s)...');
// //     await new Promise(resolve => setTimeout(resolve, 1500));
// //     console.log('✅ Firestore sync wait complete');
    
// //     // Step 6: Reload plan status
// //     console.log('🔄 Step 6/7: Reloading plan status...');
// //     await loadPlanStatus();
// //     console.log('✅ Plan status reloaded');
    
// //     // Step 7: Reload dashboard data
// //     console.log('🔄 Step 7/7: Reloading dashboard data...');
// //     await loadData();
// //     console.log('✅ Dashboard data reloaded');
    
// //     // Final success message
// //     console.log('🎉 Dashboard refresh sequence COMPLETE!');
// //     setSuccess('✅ Plan activated successfully! All features unlocked. Workers can now login.');
    
// //     // Clear success message after 7 seconds
// //     setTimeout(() => {
// //       setSuccess(null);
// //     }, 7000);
    
// //     console.log('═══════════════════════════════════════════════════════');
// //     console.log('✅ PAYMENT SUCCESS HANDLER COMPLETED SUCCESSFULLY');
// //     console.log('═══════════════════════════════════════════════════════');
    
// //   } catch (error: any) {
// //     console.error('═══════════════════════════════════════════════════════');
// //     console.error('❌ ERROR in handlePaymentSuccess:', error);
// //     console.error('═══════════════════════════════════════════════════════');
// //     setError('Payment successful but dashboard refresh failed. Please reload manually.');
// //   }
// // };  

// const handlePaymentSuccess = async () => {
//   console.log('═══════════════════════════════════════════════════════');
//   console.log('🎉 PAYMENT SUCCESS HANDLER STARTED');
//   console.log('═══════════════════════════════════════════════════════');
  
//   try {
//     // ═══════════════════════════════════════════════════════════════
//     // STEP 1: CLOSE MODALS
//     // ═══════════════════════════════════════════════════════════════
    
//     console.log('🔄 Step 1/8: Closing modals...');
//     setCheckoutOptions(null);
//     setPaymentId(null);
//     setProcessingPayment(false);
//     setSelectedPlan(null);
//     setShowPaymentConfirmation(false);
//     setShowPlansModal(false);
//     console.log('✅ Modals closed');
    
//     // ═══════════════════════════════════════════════════════════════
//     // STEP 2: SHOW SUCCESS MESSAGE
//     // ═══════════════════════════════════════════════════════════════
    
//     console.log('🔄 Step 2/8: Showing success message...');
//     setSuccess('🎉 Payment successful! Activating plan...');
//     console.log('✅ Success message shown');
    
//     // ═══════════════════════════════════════════════════════════════
//     // ✅ STEP 3: ENABLE WORKERS FIRST (BEFORE REFRESH!)
//     // ═══════════════════════════════════════════════════════════════
    
//     console.log('🔄 Step 3/8: Enabling workers (BEFORE refresh)...');
    
//     try {
//       const { enableAllSellersWorkers } = await import('../lib/firebaseutils');
//       const result = await enableAllSellersWorkers(currentUser?.user_id || '');
      
//       if (result.success && result.count > 0) {
//         console.log(`✅ Enabled ${result.count} worker(s)`);
//         setSuccess(`🎉 Plan activated! ${result.count} worker(s) enabled.`);
//       } else {
//         console.log('ℹ️ No workers to enable');
//       }
//     } catch (workerError: any) {
//       console.warn('⚠️ Worker enable failed:', workerError);
//     }
    
//     console.log('✅ Worker enablement complete');
    
//     // ═══════════════════════════════════════════════════════════════
//     // STEP 4: WAIT FOR FIRESTORE PROPAGATION
//     // ═══════════════════════════════════════════════════════════════
    
//     console.log('🔄 Step 4/8: Waiting for Firestore (2s)...');
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     console.log('✅ Firestore wait complete');
    
//     // ═══════════════════════════════════════════════════════════════
//     // ✅ STEP 5: NOW TRIGGER REFRESH (SAFE - WORKERS ALREADY ENABLED)
//     // ═══════════════════════════════════════════════════════════════
    
//     console.log('🔄 Step 5/8: Triggering refresh (NOW SAFE)...');
//     setPlanRefreshTrigger(prev => prev + 1);
//     console.log('✅ Refresh triggered');
    
//     // ═══════════════════════════════════════════════════════════════
//     // STEP 6: UI SYNC WAIT
//     // ═══════════════════════════════════════════════════════════════
    
//     console.log('🔄 Step 6/8: UI sync (1s)...');
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     console.log('✅ UI sync complete');
    
//     // ═══════════════════════════════════════════════════════════════
//     // STEP 7: RELOAD PLAN STATUS
//     // ═══════════════════════════════════════════════════════════════
    
//     console.log('🔄 Step 7/8: Reloading plan status...');
//     await loadPlanStatus();
//     console.log('✅ Plan status reloaded');
    
//     // ═══════════════════════════════════════════════════════════════
//     // STEP 8: RELOAD DASHBOARD
//     // ═══════════════════════════════════════════════════════════════
    
//     console.log('🔄 Step 8/8: Reloading dashboard...');
//     await loadData();  // ✅ CORRECT - No parameters needed
//     console.log('✅ Dashboard reloaded');
    
//     // ═══════════════════════════════════════════════════════════════
//     // FINAL SUCCESS
//     // ═══════════════════════════════════════════════════════════════
    
//     console.log('🎉 All steps complete!');
//     setSuccess('✅ Plan activated! Workers can now login.');
    
//     setTimeout(() => setSuccess(null), 7000);
    
//     console.log('═══════════════════════════════════════════════════════');
//     console.log('✅ PAYMENT SUCCESS HANDLER COMPLETED');
//     console.log('═══════════════════════════════════════════════════════');
    
//   } catch (error: any) {
//     console.error('═══════════════════════════════════════════════════════');
//     console.error('❌ ERROR:', error);
//     console.error('═══════════════════════════════════════════════════════');
//     setError('Payment successful but refresh failed. Reload page manually.');
//   }
// };




//   // const checkSellerPlanStatus = async (sellerId: string): Promise<SellerPlanStatus> => {
//   //   try {
//   //     console.log('🔍 Checking plan status for seller:', sellerId);

//   //     setPlanStatus(prev => ({ ...prev, loading: true }));

//   //     const subscriptionsRef = collection(db, 'subscriptions');
//   //     const q = query(
//   //       subscriptionsRef,
//   //       where('seller_id', '==', sellerId),
//   //       where('status', '==', 'active'),
//   //       orderBy('end_date', 'desc'),
//   //       limit(1)
//   //     );

//   //     const snapshot = await getDocs(q);

//   //     if (snapshot.empty) {
//   //       console.log('❌ No active plan found for seller:', sellerId);
//   //       return {
//   //         isActive: false,
//   //         expiresAt: null,
//   //         planName: null,
//   //         planId: null,
//   //         daysRemaining: 0,
//   //         loading: false,
//   //         lastChecked: new Date()
//   //       };
//   //     }

//   //     const subscription = snapshot.docs[0].data();
//   //     const endDate = subscription.end_date?.toDate ? subscription.end_date.toDate() : null;
//   //     const now = new Date();

//   //     const isExpired = endDate ? endDate < now : true;

//   //     if (isExpired) {
//   //       console.log('⏰ Plan expired on:', endDate);
//   //       return {
//   //         isActive: false,
//   //         expiresAt: endDate,
//   //         planName: subscription.plan_name || null,
//   //         planId: subscription.plan_id || null,
//   //         daysRemaining: 0,
//   //         loading: false,
//   //         lastChecked: new Date()
//   //       };
//   //     }

//   //     const daysRemaining = endDate 
//   //       ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
//   //       : 0;

//   //     console.log('✅ Active plan found:', {
//   //       planName: subscription.plan_name,
//   //       expiresAt: endDate,
//   //       daysRemaining
//   //     });

//   //     return {
//   //       isActive: true,
//   //       expiresAt: endDate,
//   //       planName: subscription.plan_name || null,
//   //       planId: subscription.plan_id || null,
//   //       daysRemaining,
//   //       loading: false,
//   //       lastChecked: new Date()
//   //     };

//   //   } catch (error: any) {
//   //     console.error('❌ Error checking plan status:', error);
      
//   //     return {
//   //       isActive: false,
//   //       expiresAt: null,
//   //       planName: null,
//   //       planId: null,
//   //       daysRemaining: 0,
//   //       loading: false,
//   //       lastChecked: new Date()
//   //     };
//   //   }
//   // }; 

// const checkSellerPlanStatus = async (sellerId: string): Promise<SellerPlanStatus> => {
//   try {
//     console.log('🔍 Checking plan status via subscriptionService:', sellerId);
    
//     // ✅ Use robust service function with fallback
//     const subscription = await getSellerSubscription(sellerId);
    
//     if (!subscription) {
//       console.log('❌ No subscription found');
//       return {
//         isActive: false,
//         expiresAt: null,
//         planName: null,
//         planId: null,
//         daysRemaining: 0,
//         loading: false,
//         lastChecked: new Date()
//       };
//     }
    
//     // ✅ Check expiry using service helper
//     const expired = isSubscriptionExpired(subscription);
//     const daysRemaining = getDaysUntilExpiry(subscription);
    
//     const endDate = subscription.end_date 
//       ? new Date(subscription.end_date) 
//       : null;
    
//     console.log('✅ Plan status checked:', {
//       isActive: !expired,
//       planName: subscription.plan_name,
//       daysRemaining,
//       expired
//     });
    
//     return {
//       isActive: !expired,
//       expiresAt: endDate,
//       planName: subscription.plan_name || null,
//       planId: subscription.plan_id || null,
//       daysRemaining,
//       loading: false,
//       lastChecked: new Date()
//     };
    
//   } catch (error: any) {
//     console.error('❌ Error checking plan status:', error);
    
//     // ✅ Even on error, return safe default
//     return {
//       isActive: false,
//       expiresAt: null,
//       planName: null,
//       planId: null,
//       daysRemaining: 0,
//       loading: false,
//       lastChecked: new Date()
//     };
//   }
// };
//   // ✅ LOAD PLAN STATUS
//   const loadPlanStatus = async () => {
//     if (!currentUser?.user_id) {
//       console.log('⚠️ No user ID, skipping plan check');
//       return;
//     }

//     try {
//       console.log('🔄 Loading plan status...');
//       const status = await checkSellerPlanStatus(currentUser.user_id);
//       setPlanStatus(status);
      
//       console.log('✅ Plan status loaded:', {
//         isActive: status.isActive,
//         planName: status.planName,
//         daysRemaining: status.daysRemaining
//       });
//     } catch (error: any) {
//       console.error('❌ Error loading plan status:', error);
      
//       setPlanStatus({
//         isActive: false,
//         expiresAt: null,
//         planName: null,
//         planId: null,
//         daysRemaining: 0,
//         loading: false,
//         lastChecked: new Date()
//       });
//     }
//   };

//   // ✅ CHECK IF FEATURE IS ALLOWED
//   const isFeatureAllowed = (feature: 'scan' | 'worker' | 'analytics'): boolean => {
//     if (planStatus.loading) {
//       return false;
//     }

//     if (!planStatus.isActive) {
//       return false;
//     }

//     return true;
//   };

//   // ✅ GET DISABLED REASON MESSAGE
//   const getDisabledReason = (): string => {
//     if (planStatus.loading) {
//       return 'Checking plan status...';
//     }

//     if (!planStatus.isActive) {
//       if (planStatus.expiresAt) {
//         return `Your plan expired on ${planStatus.expiresAt.toLocaleDateString()}. Please renew to continue.`;
//       }
//       return 'No active plan. Please subscribe to access this feature.';
//     }
    
//     if (planStatus.daysRemaining <= 3) {
//       return `Your plan expires in ${planStatus.daysRemaining} days. Consider renewing soon.`;
//     }

//     return '';
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ EFFECTS
//   // ═══════════════════════════════════════════════════════════════

//   useEffect(() => {
//     console.log("🔍 SellerDashboard Auth Check:", {
//       currentUser: currentUser?.email || "null",
//       isAuthenticated,
//       userRole: currentUser?.role || "null",
//     });

//     if (currentUser && isAuthenticated) {
//       loadData();
//       loadPlanStatus();
//     } else if (currentUser === null && !isAuthenticated) {
//       setLoading(false);
//     }
//   }, [currentUser, isAuthenticated]);

//   useEffect(() => {
//     if (currentUser?.user_id && isAuthenticated && planRefreshTrigger > 0) {
//       console.log('🔄 Plan refresh triggered, reloading plan status...');
//       loadPlanStatus();
//     }
//   }, [planRefreshTrigger, currentUser?.user_id, isAuthenticated]);

//   useEffect(() => {
//     filterTiles();
//     setCurrentPage(1);
//   }, [tiles, searchTerm, categoryFilter, stockFilter]);

//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => {
//         setError(null);
//         setSuccess(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success]);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ DATA LOADING
//   // ═══════════════════════════════════════════════════════════════

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log("🔄 Loading seller data for:", currentUser?.email);

//       const [profile, sellerTiles] = await Promise.all([
//         getSellerProfile(currentUser?.user_id || ""),
//         getSellerTiles(currentUser?.user_id || ""),
//       ]);

//       setSellerProfile(profile);

//       if (sellerTiles && sellerTiles.length > 0) {
//         const uniqueTilesMap = new Map();
//         sellerTiles.forEach((tile) => {
//           if (tile.id && !uniqueTilesMap.has(tile.id)) {
//             uniqueTilesMap.set(tile.id, tile);
//           }
//         });

//         const uniqueTiles = Array.from(uniqueTilesMap.values());

//         console.log("✅ Seller data loaded:", {
//           profile: profile?.business_name || "No profile",
//           tilesRaw: sellerTiles.length,
//           tilesUnique: uniqueTiles.length,
//         });

//         setTiles(uniqueTiles);
//       } else {
//         setTiles([]);
//         console.log("ℹ️ No tiles found");
//       }
//     } catch (error: any) {
//       console.error("❌ Error loading seller data:", error);
//       setError("Failed to load dashboard data. Please refresh the page.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ FILTERING
//   // ═══════════════════════════════════════════════════════════════

//   const filterTiles = () => {
//     let filtered = tiles;

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (tile) =>
//           tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           tile.tileCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           tile.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           tile.tileSurface?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           tile.tileMaterial?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (categoryFilter !== "all") {
//       filtered = filtered.filter((tile) => tile.category === categoryFilter);
//     }

//     if (stockFilter === "in-stock") {
//       filtered = filtered.filter((tile) => tile.inStock);
//     } else if (stockFilter === "out-of-stock") {
//       filtered = filtered.filter((tile) => !tile.inStock);
//     }

//     setFilteredTiles(filtered);
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ PAGINATION
//   // ═══════════════════════════════════════════════════════════════

//   const totalPages = Math.ceil(filteredTiles.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentTiles = filteredTiles.slice(indexOfFirstItem, indexOfLastItem);

//   const goToPage = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const getPageNumbers = () => {
//     const pages = [];
//     const maxPagesToShow = 5;

//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 4; i++) pages.push(i);
//         pages.push('...');
//         pages.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1);
//         pages.push('...');
//         for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
//       } else {
//         pages.push(1);
//         pages.push('...');
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
//         pages.push('...');
//         pages.push(totalPages);
//       }
//     }

//     return pages;
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ PAYMENT HANDLERS
//   // ═══════════════════════════════════════════════════════════════

//   const handlePlanSelection = async (planId: string) => {
//     try {
//       console.log('📦 Selected plan:', planId);
      
//       if (!isAuthenticated) {
//         console.log('🔐 User not authenticated');
//         setShowPlansModal(false);
//         setError('Please login to select a plan');
//         return;
//       }

//       console.log('📋 Fetching plan details...');
//       const plan = await getPlanById(planId);
      
//       if (!plan) {
//         setError('❌ Plan not found. Please try again.');
//         return;
//       }

//       setSelectedPlan(plan);
//       setShowPlansModal(false);
//       setShowPaymentConfirmation(true);
      
//     } catch (error: any) {
//       console.error('❌ Error selecting plan:', error);
//       setError(`❌ Error: ${error.message}`);
//     }
//   };

//   const handlePaymentConfirm = async () => {
//     if (!selectedPlan) {
//       setError('❌ No plan selected');
//       return;
//     }

//     setProcessingPayment(true);

//     try {
//       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

//       const currentUserAuth = auth.currentUser;
//       if (!currentUserAuth) {
//         throw new Error('Please login first');
//       }

//       const result = await initiatePayment(
//         selectedPlan.id,
//         selectedPlan.plan_name,
//         selectedPlan.price
//       );

//       if (!result.success || !result.checkoutOptions || !result.paymentId) {
//         throw new Error(result.error || 'Failed to initiate payment');
//       }

//       console.log('✅ Payment initiated successfully');
//       console.log('📝 Payment ID:', result.paymentId);

//       setCheckoutOptions(result.checkoutOptions);
//       setPaymentId(result.paymentId);
//       setShowPaymentConfirmation(false);

//     } catch (error: any) {
//       console.error('❌ Payment initiation error:', error);
//       setError(`❌ Payment Error: ${error.message}`);
//       setProcessingPayment(false);
//     }
//   };

//   // const handlePaymentError = (error: string) => {
//   //   console.error('❌ Payment checkout error:', error);
//   //   setError(`❌ Payment Error: ${error}`);
    
//   //   setCheckoutOptions(null);
//   //   setPaymentId(null);
//   //   setProcessingPayment(false);
//   //   setSelectedPlan(null);

//   //   setTimeout(() => {
//   //     console.log('🔄 Reloading plan status after payment...');
//   //     loadPlanStatus();
//   //     setPlanRefreshTrigger(prev => prev + 1);
//   //   }, 2000);
//   // };



//   // ═══════════════════════════════════════════════════════════════
//   // ✅ TILE MANAGEMENT FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════
// const handlePaymentError = async (error: string) => {
//   console.error('═══════════════════════════════════════════════════════');
//   console.error('❌ PAYMENT ERROR:', error);
//   console.error('═══════════════════════════════════════════════════════');
  
//   setError(`❌ Payment Error: ${error}`);
  
//   // Close all payment modals
//   console.log('🧹 Cleaning up payment state...');
//   setCheckoutOptions(null);
//   setPaymentId(null);
//   setProcessingPayment(false);
//   setSelectedPlan(null);
//   setShowPaymentConfirmation(false);
//   console.log('✅ Payment state cleaned');
  
//   // Reload plan status to verify current state
//   setTimeout(async () => {
//     console.log('🔄 Reloading plan status after error (in case payment actually succeeded)...');
//     await loadPlanStatus();
//     console.log('✅ Plan status check complete after error');
//   }, 2000);
  
//   console.log('═══════════════════════════════════════════════════════');
// };
//   const generateTileCode = (): string => {
//     const prefix =
//       sellerProfile?.business_name?.substring(0, 3).toUpperCase() || "TIL";
//     const timestamp = Date.now().toString().slice(-6);
//     const random = Math.random().toString(36).substring(2, 4).toUpperCase();
//     return `${prefix}${timestamp}${random}`;
//   };

//   const handleImageUpload = async (file: File, type: "image" | "texture") => {
//     try {
//       if (type === "image") {
//         setImageUploading(true);
//       } else {
//         setTextureUploading(true);
//       }

//       if (!file.type.startsWith("image/")) {
//         throw new Error("Please select a valid image file");
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         throw new Error("Image size should be less than 5MB");
//       }

//       console.log(`🔄 Uploading ${type}:`, file.name);
//       const imageUrl = await uploadToCloudinary(
//         file,
//         type === "image" ? "tiles/main" : "tiles/textures"
//       );

//       if (type === "image") {
//         setNewTile((prev) => ({ ...prev, imageUrl }));
//       } else {
//         setNewTile((prev) => ({ ...prev, textureUrl: imageUrl }));
//       }

//       setSuccess(
//         `${type === "image" ? "Image" : "Texture"} uploaded successfully`
//       );
//       console.log(`✅ ${type} uploaded:`, imageUrl);
//     } catch (error: any) {
//       console.error(`❌ ${type} upload failed:`, error);
//       setError(error.message || `Failed to upload ${type}`);
//     } finally {
//       if (type === "image") {
//         setImageUploading(false);
//       } else {
//         setTextureUploading(false);
//       }
//     }
//   };

//   const validateTileForm = (): string | null => {
//     if (!newTile.name?.trim()) {
//       return "❌ Tile Name is required. Please enter a tile name.";
//     }

//     if (!newTile.size?.trim()) {
//       return "❌ Tile Size is required. Please enter or select a size (e.g., 60x60 cm).";
//     }

//     if (!newTile.price || newTile.price <= 0) {
//       return "❌ Valid Price is required. Please enter a price greater than 0.";
//     }

//     if (newTile.stock === undefined || newTile.stock < 0) {
//       return "❌ Valid Stock Quantity is required. Please enter stock (0 or more).";
//     }

//     if (!newTile.imageUrl?.trim()) {
//       return "❌ Tile Image is required. Please upload an image before saving.";
//     }

//     return null;
//   };

//   const handleAddTile = async () => {
//     try {
//       setError(null);

//       const validationError = validateTileForm();
//       if (validationError) {
//         setError(validationError);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         setTimeout(() => {
//           setError((prev) => (prev === validationError ? null : prev));
//         }, 8000);
//         return;
//       }

//       if (!currentUser) {
//         setError("User not authenticated");
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         return;
//       }

//       console.log("🔄 Step 1/4: Preparing tile data...");

//       const tileCode = newTile.tileCode || generateTileCode();

//       const baseTileData = {
//         ...newTile,
//         sellerId: currentUser.user_id,
//         showroomId: currentUser.user_id,
//         tileCode: tileCode,
//         inStock: (newTile.stock || 0) > 0,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       console.log("💾 Step 2/4: Saving tile to database...");

//       const savedTile = await uploadTile(baseTileData);

//       if (!savedTile || !savedTile.id) {
//         throw new Error("Tile saved but ID not returned");
//       }

//       console.log("✅ Tile saved with ID:", savedTile.id);
//       console.log("📱 Step 3/4: Generating QR code...");

//       let qrCodeGenerated = false;
//       try {
//         const qrCodeDataUrl = await generateTileQRCode(savedTile);
//         console.log("✅ QR code generated successfully");
//         console.log("🔄 Step 4/4: Updating tile with QR code...");
//         await updateTileQRCode(savedTile.id, qrCodeDataUrl);
//         console.log("✅ Tile updated with QR code");
//         qrCodeGenerated = true;
//       } catch (qrError: any) {
//         console.warn("⚠️ QR code generation failed:", qrError.message);
//       }

//       await loadData();

//       setIsAddingTile(false);
//       resetNewTile();

//       if (qrCodeGenerated) {
//         setSuccess("✅ Tile added successfully with QR code!");
//       } else {
//         setSuccess("✅ Tile added! QR code can be generated from QR Codes tab.");
//       }

//       console.log("🎉 Tile creation completed!");
//     } catch (error: any) {
//       console.error("❌ Tile creation failed:", error);
//       setError(`Failed to add tile: ${error.message}`);
//     }
//   };

//   const handleEditTile = async (tile: Tile) => {
//     console.log("🔄 Editing tile:", tile.name);
//     setEditingTile(tile);
//     setNewTile({
//       ...tile,
//       stock: tile.stock || 0,
//     });
//     setIsAddingTile(false);
//     setError(null);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleUpdateTile = async () => {
//     try {
//       setError(null);

//       const validationError = validateTileForm();
//       if (validationError) {
//         setError(validationError);
//         return;
//       }

//       if (!editingTile) {
//         setError("No tile selected for editing");
//         return;
//       }

//       console.log("🔄 Starting tile update:", editingTile.name);

//       const updates = {
//         ...newTile,
//         inStock: (newTile.stock || 0) > 0,
//         updatedAt: new Date().toISOString(),
//       };

//       console.log("💾 Updating tile in database...");
//       await updateTile(editingTile.id, updates);
//       console.log("✅ Tile updated in database");

//       const criticalFieldsChanged =
//         editingTile.name !== newTile.name ||
//         editingTile.tileCode !== newTile.tileCode ||
//         editingTile.price !== newTile.price ||
//         editingTile.size !== newTile.size ||
//         editingTile.category !== newTile.category;

//       if (criticalFieldsChanged) {
//         console.log("🔄 Critical fields changed, attempting QR regeneration...");

//         setTimeout(async () => {
//           try {
//             if (typeof getTileById !== "function") {
//               console.warn("⚠️ getTileById not available, skipping QR regeneration");
//               return;
//             }

//             if (typeof generateTileQRCode !== "function") {
//               console.warn("⚠️ generateTileQRCode not available, skipping QR regeneration");
//               return;
//             }

//             if (typeof updateTileQRCode !== "function") {
//               console.warn("⚠️ updateTileQRCode not available, skipping QR regeneration");
//               return;
//             }

//             console.log("📱 Fetching updated tile data...");
//             const updatedTileData = await getTileById(editingTile.id);

//             if (!updatedTileData) {
//               console.warn("⚠️ Could not fetch updated tile, skipping QR regeneration");
//               return;
//             }

//             console.log("📱 Generating new QR code...");
//             const newQRCode = await generateTileQRCode(updatedTileData);

//             if (!newQRCode || !newQRCode.startsWith("data:image")) {
//               console.warn("⚠️ Invalid QR code generated, skipping update");
//               return;
//             }

//             console.log("💾 Updating QR code in database...");
//             await updateTileQRCode(editingTile.id, newQRCode);

//             console.log("✅ QR code regenerated successfully");

//             await loadData();
//           } catch (qrError: any) {
//             console.error("⚠️ QR regeneration failed (non-critical):", qrError.message);
//           }
//         }, 0);
//       } else {
//         console.log("ℹ️ No critical fields changed, keeping existing QR code");
//       }

//       console.log("🔄 Reloading tiles list...");
//       await loadData();

//       setEditingTile(null);
//       resetNewTile();

//       setSuccess("Tile updated successfully!");
//       console.log("✅ Tile update complete");
//     } catch (error: any) {
//       console.error("❌ Error updating tile:", error);
//       setError(`Failed to update tile: ${error.message}`);
//     }
//   };

//   const handleDeleteTile = async (tileId: string, tileName: string) => {
//     if (!window.confirm(`Delete "${tileName}"?`)) return;

//     try {
//       setError(null);
//       console.log("🔥 Deleting:", tileId);

//       await deleteTile(tileId);

//       console.log("✅ Deleted from database");

//       await loadData();

//       setSuccess("Tile deleted successfully");
//     } catch (error: any) {
//       console.error("❌ Delete failed:", error);
//       setError(`Delete failed: ${error.message}`);
//     }
//   };

//   const resetNewTile = () => {
//     setNewTile({
//       name: "",
//       category: "both",
//       size: "",
//       price: 0,
//       stock: 0,
//       inStock: true,
//       imageUrl: "",
//       textureUrl: "",
//       tileCode: "",
//       tileSurface: "",
//       tileMaterial: "",
//     });
//   };

//   const handleTabChange = (tab: typeof activeTab) => {
//     setActiveTab(tab);
//     setError(null);
//     setSuccess(null);
//     setMobileMenuOpen(false);
//     console.log("🎯 Switched to tab:", tab);
//   };

//   const getStockStatusColor = (tile: Tile) => {
//     if (!tile.inStock) return "bg-red-100 text-red-800";
//     if ((tile.stock || 0) < 10) return "bg-yellow-100 text-yellow-800";
//     return "bg-green-100 text-green-800";
//   };

//   const getStockStatusText = (tile: Tile) => {
//     if (!tile.inStock) return "Out of Stock";
//     if ((tile.stock || 0) < 10) return "Low Stock";
//     return "In Stock";
//   };

//   // ✅ Compute feature access
//   const isScanAllowed = isFeatureAllowed('scan');
//   const isWorkerAllowed = isFeatureAllowed('worker');
//   const disabledMessage = getDisabledReason();

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER GUARDS
//   // ═══════════════════════════════════════════════════════════════

//   if (!isAuthenticated) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
//         <div className="text-center py-8 sm:py-12">
//           <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
//             Authentication Required
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
//             Please log in to access the seller dashboard.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
//           >
//             Refresh Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
//         <div className="text-center py-8 sm:py-12">
//           <User className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
//             User Profile Not Found
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
//             Unable to load user profile. Please try logging in again.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
//           >
//             Reload Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (currentUser.role !== "seller") {
//     return (
//       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
//         <div className="text-center py-8 sm:py-12">
//           <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-4" />
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
//             Access Denied
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
//             This dashboard is only accessible to sellers. Your role:{" "}
//             <strong>{currentUser.role}</strong>
//           </p>
//           <button
//             onClick={() => (window.location.href = "/")}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
//           >
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-green-600 mx-auto mb-4" />
//             <p className="text-gray-600 text-base sm:text-lg">
//               Loading dashboard...
//             </p>
//             <p className="text-gray-500 text-xs sm:text-sm mt-2 px-4">
//               Loading data for {currentUser.full_name || currentUser.email}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ MAIN RENDER
//   // ═══════════════════════════════════════════════════════════════

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
//       {/* HEADER */}
//       <div className="flex flex-col gap-4 mb-4 sm:mb-6">
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//             <Store className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
//             <div className="min-w-0">
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
//                 Seller Dashboard
//               </h2>
//               <p className="text-xs sm:text-sm text-gray-600 truncate">
//                 {sellerProfile?.business_name || "Your Business"}
//               </p>

//               <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500">
//                 <span className="flex items-center gap-1 whitespace-nowrap">
//                   <Package className="w-3 h-3 sm:w-4 sm:h-4" />
//                   {tiles.length} Total
//                 </span>
//                 <span className="flex items-center gap-1 text-green-600 whitespace-nowrap">
//                   <Package className="w-3 h-3 sm:w-4 sm:h-4" />
//                   {tiles.filter((t) => t.inStock).length} Stock
//                 </span>
//                 <span className="flex items-center gap-1 text-red-600 whitespace-nowrap">
//                   <Package className="w-3 h-3 sm:w-4 sm:h-4" />
//                   {tiles.filter((t) => !t.inStock).length} Out
//                 </span>
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="lg:hidden flex-shrink-0 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             {mobileMenuOpen ? (
//               <X className="w-6 h-6" />
//             ) : (
//               <Menu className="w-6 h-6" />
//             )}
//           </button>
//         </div>

//         <PlanStatusBanner 
//           sellerId={currentUser?.user_id || ''} 
//           onViewPlans={() => setShowPlansModal(true)}
//           forceRefresh={planRefreshTrigger}
//         />

//         {/* DESKTOP TABS */}
//         <div className="hidden lg:flex gap-2 flex-wrap">
//           <button
//             onClick={() => handleTabChange("tiles")}
//             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//               activeTab === "tiles"
//                 ? "bg-green-600 text-white shadow-md"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             <Edit className="w-4 h-4" />
//             My Tiles
//           </button>
          
//           <button
//             onClick={() => isWorkerAllowed ? handleTabChange("worker") : setShowPlansModal(true)}
//             disabled={!isWorkerAllowed}
//             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium relative ${
//               activeTab === "worker"
//                 ? "bg-green-600 text-white shadow-md"
//                 : !isWorkerAllowed
//                 ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//             title={!isWorkerAllowed ? disabledMessage : "Manage Workers"}
//           >
//             <User className="w-4 h-4" />
//             Worker
//             {!isWorkerAllowed && (
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
//             )}
//           </button>
          
//           <button
//             onClick={() => handleTabChange("customer-inquiries")}
//             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//               activeTab === "customer-inquiries"
//                 ? "bg-green-600 text-white shadow-md"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             <Users className="w-4 h-4" />
//             Customers
//           </button>
          
//           <button
//             onClick={() => setShowPlansModal(true)}
//             className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
//           >
//             <Eye className="w-4 h-4" />
//             View Plans
//           </button>
          
//           <button
//             onClick={() => isScanAllowed ? window.open("/scan", "_blank") : setShowPlansModal(true)}
//             disabled={!isScanAllowed}
//             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium shadow-md relative ${
//               !isScanAllowed
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
//                 : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg"
//             }`}
//             title={!isScanAllowed ? disabledMessage : "Open QR Scanner"}
//           >
//             <QrCode className="w-4 h-4" />
//             Scan
//             {!isScanAllowed && (
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
//             )}
//           </button>
          
//           <button
//             onClick={() => handleTabChange("profile")}
//             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//               activeTab === "profile"
//                 ? "bg-green-600 text-white shadow-md"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             <User className="w-4 h-4" />
//             Profile
//           </button>
          
//           <button
//             onClick={() => handleTabChange("excel")}
//             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//               activeTab === "excel"
//                 ? "bg-green-600 text-white shadow-md"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             <FileSpreadsheet className="w-4 h-4" />
//             Excel
//           </button>
          
//           <button
//             onClick={() => handleTabChange("stock-analytics")}
//             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//               activeTab === "stock-analytics"
//                 ? "bg-green-600 text-white shadow-md"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             <Package className="w-4 h-4" />
//             Stock Analytics
//           </button>
          
//           <button
//             onClick={() => handleTabChange("bulk")}
//             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//               activeTab === "bulk"
//                 ? "bg-green-600 text-white shadow-md"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             <Upload className="w-4 h-4" />
//             CSV
//           </button>
          
//           <button
//             onClick={() => handleTabChange("qrcodes")}
//             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//               activeTab === "qrcodes"
//                 ? "bg-green-600 text-white shadow-md"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             <QrCode className="w-4 h-4" />
//             QR Codes
//           </button>
//         </div>

//         {/* MOBILE TABS */}
//         {mobileMenuOpen && (
//           <div className="lg:hidden grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
//             <button
//               onClick={() => handleTabChange("tiles")}
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//                 activeTab === "tiles"
//                   ? "bg-green-600 text-white shadow-md"
//                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//               }`}
//             >
//               <Edit className="w-4 h-4" />
//               Tiles
//             </button>
            
//             <button
//               onClick={() => handleTabChange("customer-inquiries")}
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//                 activeTab === "customer-inquiries"
//                   ? "bg-green-600 text-white shadow-md"
//                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//               }`}
//             >
//               <Users className="w-4 h-4" />
//               Customers
//             </button>
            
//             <button
//               onClick={() => {
//                 if (isWorkerAllowed) {
//                   handleTabChange("worker");
//                 } else {
//                   setShowPlansModal(true);
//                   setMobileMenuOpen(false);
//                 }
//               }}
//               disabled={!isWorkerAllowed}
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium relative ${
//                 activeTab === "worker"
//                   ? "bg-green-600 text-white shadow-md"
//                   : !isWorkerAllowed
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60 border border-gray-300"
//                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//               }`}
//               title={!isWorkerAllowed ? "Plan expired - Click to renew" : undefined}
//             >
//               <User className="w-4 h-4" />
//               Worker
//               {!isWorkerAllowed && (
//                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
//               )}
//             </button>
            
//             <button
//               onClick={() => {
//                 setShowPlansModal(true);
//                 setMobileMenuOpen(false);
//               }}
//               className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 text-sm font-medium shadow-md"
//             >
//               <Eye className="w-4 h-4" />
//               Plans
//             </button>
            
//             <button
//               onClick={() => {
//                 if (isScanAllowed) {
//                   window.open("/scan", "_blank");
//                 } else {
//                   setShowPlansModal(true);
//                   setMobileMenuOpen(false);
//                 }
//               }}
//               disabled={!isScanAllowed}
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium shadow-md relative ${
//                 !isScanAllowed
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
//                   : "bg-purple-600 text-white hover:bg-purple-700"
//               }`}
//               title={!isScanAllowed ? "Plan expired - Click to renew" : undefined}
//             >
//               <QrCode className="w-4 h-4" />
//               Scan
//               {!isScanAllowed && (
//                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
//               )}
//             </button>
            
//             <button
//               onClick={() => handleTabChange("profile")}
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//                 activeTab === "profile"
//                   ? "bg-green-600 text-white shadow-md"
//                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//               }`}
//             >
//               <User className="w-4 h-4" />
//               Profile
//             </button>
            
//             <button
//               onClick={() => handleTabChange("excel")}
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//                 activeTab === "excel"
//                   ? "bg-green-600 text-white shadow-md"
//                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//               }`}
//             >
//               <FileSpreadsheet className="w-4 h-4" />
//               Excel
//             </button>
            
//             <button
//               onClick={() => handleTabChange("stock-analytics")}
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//                 activeTab === "stock-analytics"
//                   ? "bg-green-600 text-white shadow-md"
//                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//               }`}
//             >
//               <Package className="w-4 h-4" />
//               Stock
//             </button>
            
//             <button
//               onClick={() => handleTabChange("bulk")}
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//                 activeTab === "bulk"
//                   ? "bg-green-600 text-white shadow-md"
//                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//               }`}
//             >
//               <Upload className="w-4 h-4" />
//               CSV
//             </button>
            
//             <button
//               onClick={() => handleTabChange("qrcodes")}
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//                 activeTab === "qrcodes"
//                   ? "bg-green-600 text-white shadow-md"
//                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//               }`}
//             >
//               <QrCode className="w-4 h-4" />
//               QR
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ✅✅✅ PLAN EXPIRY ALERTS ✅✅✅ */}

//       {!planStatus.loading && !planStatus.isActive && (
//         <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg shadow-md">
//           <div className="flex items-start gap-3">
//             <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mt-0.5 flex-shrink-0 animate-pulse" />
//             <div className="flex-1 min-w-0">
             
             
//               <div className="space-y-2 mb-3 text-xs sm:text-sm text-orange-700">
//                 <p className="flex items-center gap-2">
//                   <X className="w-4 h-4 text-red-600" />
//                   <strong>Worker Management:</strong> Disabled
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <X className="w-4 h-4 text-red-600" />
//                   <strong>QR Scanning:</strong> Disabled
//                 </p>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <button
//                   onClick={() => setShowPlansModal(true)}
//                   className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold"
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                   Renew Plan Now
//                 </button>
//                 <button
//                   onClick={loadPlanStatus}
//                   className="flex items-center justify-center gap-2 bg-white border border-orange-300 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                   Check Status
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {!planStatus.loading && planStatus.isActive && planStatus.daysRemaining <= 7 && (
//         <div className="mb-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
//           <div className="flex items-start gap-3">
//             <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
//             <div className="flex-1">
//               <p className="text-yellow-900 font-medium text-sm sm:text-base flex items-center gap-2">
//                 <AlertCircle className="w-4 h-4" />
//                 ⏰ Plan Expiring Soon
//               </p>
//               <p className="text-yellow-800 text-xs sm:text-sm mt-1">
//                 Your <strong>{planStatus.planName}</strong> plan expires in{" "}
//                 <strong>{planStatus.daysRemaining} days</strong>. Renew now to avoid service interruption.
//               </p>
//               <button
//                 onClick={() => setShowPlansModal(true)}
//                 className="mt-2 flex items-center gap-2 bg-yellow-600 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-700 transition-colors text-xs sm:text-sm font-medium"
//               >
//                 <RefreshCw className="w-3 h-3" />
//                 Renew Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ALERT MESSAGES */}
      
//       {error && (
//         <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3 animate-shake">
//           <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//           <div className="flex-1 min-w-0">
//             <p className="text-red-800 font-medium text-sm sm:text-base">
//               Error
//             </p>
//             <p className="text-red-700 text-xs sm:text-sm break-words">
//               {error}
//             </p>
//           </div>
//           <button
//             onClick={() => setError(null)}
//             className="text-red-400 hover:text-red-600 font-bold text-lg flex-shrink-0 transition-colors"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {success && (
//         <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3 animate-slide-down">
//           <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//           <div className="flex-1 min-w-0">
//             <p className="text-green-800 font-medium text-sm sm:text-base">
//               Success
//             </p>
//             <p className="text-green-700 text-xs sm:text-sm break-words">
//               {success}
//             </p>
//           </div>
//           <button
//             onClick={() => setSuccess(null)}
//             className="text-green-400 hover:text-green-600 font-bold text-lg flex-shrink-0 transition-colors"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* ✅✅✅ TILES TAB CONTENT - COMPLETE WITH FORM, TABLE, CARDS ✅✅✅ */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       {activeTab === "tiles" && (
//         <>
//           {/* Controls - Responsive */}
//           <div className="flex flex-col gap-3 mb-4 sm:mb-6">
//             {/* Search Bar */}
//             <div className="relative">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search tiles by name, code, size, surface, material..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full text-sm sm:text-base transition-shadow"
//               />
//             </div>

//             {/* Filters Row */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2">
//               <select
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white cursor-pointer transition-shadow"
//               >
//                 <option value="all">All Categories</option>
//                 <option value="floor">Floor Only</option>
//                 <option value="wall">Wall Only</option>
//                 <option value="both">Floor & Wall</option>
//               </select>

//               <select
//                 value={stockFilter}
//                 onChange={(e) => setStockFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white cursor-pointer transition-shadow"
//               >
//                 <option value="all">All Stock</option>
//                 <option value="in-stock">In Stock</option>
//                 <option value="out-of-stock">Out of Stock</option>
//               </select>

//               <button
//                 onClick={loadData}
//                 className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium"
//                 title="Refresh Data"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 <span className="hidden sm:inline">Refresh</span>
//               </button>

//               <button
//                 onClick={() => {
//                   setIsAddingTile(true);
//                   setEditingTile(null);
//                   resetNewTile();
//                   window.scrollTo({ top: 0, behavior: 'smooth' });
//                 }}
//                 className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add New Tile
//               </button>
//             </div>

//             {/* Results Summary with Pagination Info */}
//             <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center justify-between gap-2">
//               <div>
//                 Showing {currentTiles.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
//                 {searchTerm && (
//                   <span className="font-medium"> matching "{searchTerm}"</span>
//                 )}
//               </div>
//               {totalPages > 1 && (
//                 <div className="text-gray-500">
//                   Page {currentPage} of {totalPages}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Add/Edit Tile Form - Responsive */}
//           {(isAddingTile || editingTile) && (
//             <div className="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6 border-2 border-dashed border-green-300 rounded-xl bg-green-50">
//               <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
//                 {editingTile ? (
//                   <>
//                     <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
//                     <span className="truncate">Edit: {editingTile.name}</span>
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
//                     Add New Tile
//                   </>
//                 )}
//               </h3>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                 {/* Tile Name */}
//                 <div className="space-y-2">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                     Tile Name *
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter tile name"
//                     value={newTile.name}
//                     onChange={(e) =>
//                       setNewTile({ ...newTile, name: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
//                   />
//                 </div>

//                 {/* Tile Code */}
//                 <div className="space-y-2">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                     Tile Code
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Auto-generated if empty"
//                     value={newTile.tileCode}
//                     onChange={(e) =>
//                       setNewTile({ ...newTile, tileCode: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
//                   />
//                 </div>

//                 {/* Category */}
//                 <div className="space-y-2">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                     Category *
//                   </label>
//                   <select
//                     value={newTile.category}
//                     onChange={(e) =>
//                       setNewTile({
//                         ...newTile,
//                         category: e.target.value as any,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white cursor-pointer transition-shadow"
//                   >
//                     <option value="floor">Floor Only</option>
//                     <option value="wall">Wall Only</option>
//                     <option value="both">Floor & Wall</option>
//                   </select>
//                 </div>

//                 {/* Size */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="tile-size-select"
//                     className="block text-xs sm:text-sm font-medium text-gray-700"
//                   >
//                     Size *
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="tile-size-select"
//                       name="size"
//                       value={newTile.size}
//                       onChange={(e) => {
//                         console.log("Size selected:", e.target.value);
//                         setNewTile({ ...newTile, size: e.target.value });
//                       }}
//                       onFocus={(e) => {
//                         e.target.click();
//                       }}
//                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
//                       style={{
//                         WebkitAppearance: "none",
//                         MozAppearance: "none",
//                         touchAction: "manipulation",
//                       }}
//                     >
//                       <option value="">Select Tile Size</option>
//                       <option value="30x30 cm">30x30 cm</option>
//                       <option value="30x60 cm">30x60 cm</option>
//                       <option value="60x60 cm">60x60 cm</option>
//                       <option value="60x120 cm">60x120 cm</option>
//                       <option value="80x80 cm">80x80 cm</option>
//                       <option value="40x40 cm">40x40 cm</option>
//                       <option value="40x60 cm">40x60 cm</option>
//                       <option value="50x50 cm">50x50 cm</option>
//                       <option value="20x120 cm">20x120 cm</option>
//                       <option value="15x90 cm">15x90 cm</option>
//                       <option value="10x30 cm">10x30 cm</option>
//                       <option value="20x20 cm">20x20 cm</option>
//                       <option value="25x40 cm">25x40 cm</option>
//                       <option value="61x122 cm">61x122 cm</option>
//                       <option value="122x122 cm">122x122 cm</option>
//                       <option value="75x75 cm">75x75 cm</option>
//                       <option value="100x100 cm">100x100 cm</option>
//                       <option value="45x45 cm">45x45 cm</option>
//                       <option value="7.5x15 cm">7.5x15 cm</option>
//                       <option value="6x25 cm">6x25 cm</option>
//                     </select>

//                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <ChevronDown className="w-4 h-4 text-gray-400" />
//                     </div>
//                   </div>

//                   {newTile.size && (
//                     <div className="flex items-center gap-2 text-xs text-green-600">
//                       <CheckCircle className="w-3 h-3" />
//                       <span>Selected: {newTile.size}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Tile Surface */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="tile-surface-select"
//                     className="block text-xs sm:text-sm font-medium text-gray-700"
//                   >
//                     Tile Surface
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="tile-surface-select"
//                       name="tileSurface"
//                       value={newTile.tileSurface || ""}
//                       onChange={(e) => {
//                         console.log("Surface selected:", e.target.value);
//                         setNewTile({
//                           ...newTile,
//                           tileSurface: e.target.value || undefined,
//                         });
//                       }}
//                       onFocus={(e) => {
//                         e.target.click();
//                       }}
//                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
//                       style={{
//                         WebkitAppearance: "none",
//                         MozAppearance: "none",
//                         touchAction: "manipulation",
//                       }}
//                     >
//                       <option value="">Select Surface Finish</option>
//                       <option value="Polished">Polished</option>
//                       <option value="Step Side">Step Side</option>
//                       <option value="Matt">Matt</option>
//                       <option value="Carving">Carving</option>
//                       <option value="High Gloss">High Gloss</option>
//                       <option value="Metallic">Metallic</option>
//                       <option value="Sugar">Sugar</option>
//                       <option value="Glue">Glue</option>
//                       <option value="Punch">Punch</option>
//                     </select>

//                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <ChevronDown className="w-4 h-4 text-gray-400" />
//                     </div>
//                   </div>

//                   {newTile.tileSurface && (
//                     <div className="flex items-center gap-2 text-xs text-green-600">
//                       <CheckCircle className="w-3 h-3" />
//                       <span>Selected: {newTile.tileSurface}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Tile Material */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="tile-material-select"
//                     className="block text-xs sm:text-sm font-medium text-gray-700"
//                   >
//                     Tile Material
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="tile-material-select"
//                       name="tileMaterial"
//                       value={newTile.tileMaterial || ""}
//                       onChange={(e) => {
//                         console.log("Material selected:", e.target.value);
//                         setNewTile({
//                           ...newTile,
//                           tileMaterial: e.target.value || undefined,
//                         });
//                       }}
//                       onFocus={(e) => {
//                         e.target.click();
//                       }}
//                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
//                       style={{
//                         WebkitAppearance: "none",
//                         MozAppearance: "none",
//                         touchAction: "manipulation",
//                       }}
//                     >
//                       <option value="">Select Material Type</option>
//                       <option value="Slabs">Slabs</option>
//                       <option value="GVT & PGVT">GVT & PGVT</option>
//                       <option value="Double Charge">Double Charge</option>
//                       <option value="Counter Tops">Counter Tops</option>
//                       <option value="Full Body">Full Body</option>
//                       <option value="Ceramic">Ceramic</option>
//                       <option value="Mosaic">Mosaic</option>
//                       <option value="Subway">Subway</option>
//                     </select>

//                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <ChevronDown className="w-4 h-4 text-gray-400" />
//                     </div>
//                   </div>

//                   {newTile.tileMaterial && (
//                     <div className="flex items-center gap-2 text-xs text-green-600">
//                       <CheckCircle className="w-3 h-3" />
//                       <span>Selected: {newTile.tileMaterial}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Price */}
//                 <div className="space-y-2">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                     Price (₹) *
//                   </label>
//                   <input
//                     type="number"
//                     placeholder="Enter price"
//                     value={newTile.price || ""}
//                     onChange={(e) =>
//                       setNewTile({
//                         ...newTile,
//                         price:
//                           e.target.value === "" ? 0 : Number(e.target.value),
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>

//                 {/* Stock */}
//                 <div className="space-y-2">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                     Stock Quantity *
//                   </label>
//                   <input
//                     type="number"
//                     placeholder="Enter stock quantity"
//                     value={newTile.stock || ""}
//                     onChange={(e) =>
//                       setNewTile({
//                         ...newTile,
//                         stock:
//                           e.target.value === "" ? 0 : Number(e.target.value),
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
//                     min="0"
//                   />
//                 </div>

//                 {/* Main Image Upload */}
//                 <div className="space-y-2">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                     Tile Image *
//                   </label>
//                   <div className="flex flex-col gap-2">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file) handleImageUpload(file, "image");
//                       }}
//                       className="hidden"
//                       id="tile-image-upload"
//                     />
//                     <label
//                       htmlFor="tile-image-upload"
//                       className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium ${
//                         imageUploading ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       {imageUploading ? (
//                         <>
//                           <Loader className="w-4 h-4 animate-spin" />
//                           Uploading...
//                         </>
//                       ) : (
//                         <>
//                           <Upload className="w-4 h-4" />
//                           Choose Image
//                         </>
//                       )}
//                     </label>
//                     {newTile.imageUrl && (
//                       <div className="flex items-center gap-2">
//                         <img
//                           src={newTile.imageUrl}
//                           alt="Preview"
//                           className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
//                         />
//                         <div className="flex items-center gap-1 text-green-600">
//                           <CheckCircle className="w-4 h-4" />
//                           <span className="text-xs font-medium">Uploaded</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Texture Image Upload */}
//                 <div className="space-y-2">
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                     Texture (Optional)
//                   </label>
//                   <div className="flex flex-col gap-2">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file) handleImageUpload(file, "texture");
//                       }}
//                       className="hidden"
//                       id="texture-image-upload"
//                     />
//                     <label
//                       htmlFor="texture-image-upload"
//                       className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium ${
//                         textureUploading ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       {textureUploading ? (
//                         <>
//                           <Loader className="w-4 h-4 animate-spin" />
//                           Uploading...
//                         </>
//                       ) : (
//                         <>
//                           <Upload className="w-4 h-4" />
//                           Choose Texture
//                         </>
//                       )}
//                     </label>
//                     {newTile.textureUrl && (
//                       <div className="flex items-center gap-2">
//                         <img
//                           src={newTile.textureUrl}
//                           alt="Texture"
//                           className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
//                         />
//                         <div className="flex items-center gap-1 text-green-600">
//                           <CheckCircle className="w-4 h-4" />
//                           <span className="text-xs font-medium">Uploaded</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Form Actions */}
//               <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6">
//                 <button
//                   onClick={editingTile ? handleUpdateTile : handleAddTile}
//                   disabled={imageUploading || textureUploading}
//                   className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
//                 >
//                   <Save className="w-4 h-4" />
//                   {editingTile ? "Update Tile" : "Save Tile"}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setIsAddingTile(false);
//                     setEditingTile(null);
//                     resetNewTile();
//                     setError(null);
//                   }}
//                   className="px-4 sm:px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base font-medium"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Desktop Table View */}
//           <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//             <table className="w-full border-collapse bg-white">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-200">
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Image</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Name</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Code</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Category</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Size</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Surface</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Material</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Price</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Stock</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Status</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">QR</th>
//                   <th className="text-left p-3 font-semibold text-gray-700 text-sm">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentTiles.length === 0 ? (
//                   <tr>
//                     <td colSpan={12} className="text-center p-8 text-gray-500">
//                       {tiles.length === 0 ? (
//                         <div className="space-y-2">
//                           <Package className="w-12 h-12 text-gray-300 mx-auto" />
//                           <p className="font-medium">No tiles found</p>
//                           <p className="text-sm">Start by adding your first tile!</p>
//                         </div>
//                       ) : (
//                         <div className="space-y-2">
//                           <Search className="w-12 h-12 text-gray-300 mx-auto" />
//                           <p className="font-medium">No tiles match your search</p>
//                           <p className="text-sm">Try adjusting your search or filters</p>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ) : (
//                   currentTiles.map((tile) => (
//                     <tr
//                       key={tile.id}
//                       className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="p-3">
//                         <img
//                           src={tile.imageUrl}
//                           alt={tile.name}
//                           className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src = "/placeholder-tile.png";
//                           }}
//                         />
//                       </td>
//                       <td className="p-3">
//                         <div>
//                           <div className="font-medium text-gray-900 text-sm">{tile.name}</div>
//                           {tile.textureUrl && (
//                             <div className="text-xs text-green-600">Has texture</div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="p-3 text-xs text-gray-600 font-mono">{tile.tileCode}</td>
//                       <td className="p-3">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             tile.category === "floor"
//                               ? "bg-blue-100 text-blue-800"
//                               : tile.category === "wall"
//                               ? "bg-purple-100 text-purple-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {tile.category === "both"
//                             ? "Both"
//                             : tile.category.charAt(0).toUpperCase() + tile.category.slice(1)}
//                         </span>
//                       </td>
//                       <td className="p-3 text-gray-600 text-sm">{tile.size}</td>
//                       <td className="p-3 text-xs sm:text-sm">
//                         {tile.tileSurface ? (
//                           <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
//                             <span>🔘</span>
//                             <span>{tile.tileSurface}</span>
//                           </span>
//                         ) : (
//                           <span className="text-gray-400 text-xs">—</span>
//                         )}
//                       </td>
//                       <td className="p-3 text-xs sm:text-sm">
//                         {tile.tileMaterial ? (
//                           <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
//                             <span>🧱</span>
//                             <span>{tile.tileMaterial}</span>
//                           </span>
//                         ) : (
//                           <span className="text-gray-400 text-xs">—</span>
//                         )}
//                       </td>
//                       <td className="p-3 font-semibold text-gray-900 text-sm">
//                         ₹{tile.price.toLocaleString()}
//                       </td>
//                       <td className="p-3">
//                         <div className="text-sm">
//                           <div className="font-medium">{tile.stock || 0}</div>
//                           {(tile.stock || 0) < 10 && tile.inStock && (
//                             <div className="text-xs text-orange-600">Low</div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="p-3">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(tile)}`}
//                         >
//                           {getStockStatusText(tile)}
//                         </span>
//                       </td>
//                       <td className="p-3">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             tile.qrCode
//                               ? "bg-green-100 text-green-800"
//                               : "bg-orange-100 text-orange-800"
//                           }`}
//                         >
//                           {tile.qrCode ? "✓" : "○"}
//                         </span>
//                       </td>
//                       <td className="p-3">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleEditTile(tile)}
//                             className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
//                             title="Edit"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteTile(tile.id, tile.name)}
//                             className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile/Tablet Card View */}
//           <div className="lg:hidden space-y-3">
//             {currentTiles.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 {tiles.length === 0 ? (
//                   <div className="space-y-2">
//                     <Package className="w-16 h-16 text-gray-300 mx-auto" />
//                     <p className="font-medium">No tiles found</p>
//                     <p className="text-sm">Start by adding your first tile!</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     <Search className="w-16 h-16 text-gray-300 mx-auto" />
//                     <p className="font-medium">No tiles match your search</p>
//                     <p className="text-sm">Try adjusting your search or filters</p>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               currentTiles.map((tile) => (
//                 <div
//                   key={tile.id}
//                   className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex gap-3">
//                     <div className="flex-shrink-0">
//                       <img
//                         src={tile.imageUrl}
//                         alt={tile.name}
//                         className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src = "/placeholder-tile.png";
//                         }}
//                       />
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-2 mb-2">
//                         <div className="min-w-0 flex-1">
//                           <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
//                             {tile.name}
//                           </h3>
//                           <p className="text-xs text-gray-500 font-mono">{tile.tileCode}</p>
//                         </div>
//                         <div className="flex gap-1 flex-shrink-0">
//                           <button
//                             onClick={() => handleEditTile(tile)}
//                             className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteTile(tile.id, tile.name)}
//                             className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
//                         <div>
//                           <span className="text-gray-500">Category:</span>
//                           <div className="mt-0.5">
//                             <span
//                               className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                                 tile.category === "floor"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : tile.category === "wall"
//                                   ? "bg-purple-100 text-purple-800"
//                                   : "bg-gray-100 text-gray-800"
//                               }`}
//                             >
//                               {tile.category === "both" ? "Both" : tile.category}
//                             </span>
//                           </div>
//                         </div>
//                         <div>
//                           <span className="text-gray-500">Size:</span>
//                           <div className="font-medium text-gray-900">{tile.size}</div>
//                         </div>
//                         <div>
//                           <span className="text-gray-500">Price:</span>
//                           <div className="font-semibold text-gray-900">
//                             ₹{tile.price.toLocaleString()}
//                           </div>
//                         </div>
//                         <div>
//                           <span className="text-gray-500">Stock:</span>
//                           <div className="font-medium text-gray-900">
//                             {tile.stock || 0}
//                             {(tile.stock || 0) < 10 && tile.inStock && (
//                               <span className="text-orange-600 ml-1">(Low)</span>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       {(tile.tileSurface || tile.tileMaterial) && (
//                         <div className="mt-3 border-t border-gray-200 pt-3">
//                           <button
//                             onClick={() =>
//                               setExpandedTileId(expandedTileId === tile.id ? null : tile.id)
//                             }
//                             className="w-full flex items-center justify-between text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
//                           >
//                             <span className="flex items-center gap-1.5">
//                               <Package className="w-3.5 h-3.5" />
//                               Tile Specifications
//                             </span>
//                             {expandedTileId === tile.id ? (
//                               <ChevronUp className="w-4 h-4 text-gray-500" />
//                             ) : (
//                               <ChevronDown className="w-4 h-4 text-gray-500" />
//                             )}
//                           </button>

//                           {expandedTileId === tile.id && (
//                             <div className="mt-2 space-y-2 animate-slide-down">
//                               {tile.tileSurface && (
//                                 <div className="flex items-center justify-between text-xs">
//                                   <span className="text-gray-600 flex items-center gap-1">
//                                     <span>🔘</span>
//                                     Surface:
//                                   </span>
//                                   <span className="font-medium text-gray-900 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
//                                     {tile.tileSurface}
//                                   </span>
//                                 </div>
//                               )}
//                               {tile.tileMaterial && (
//                                 <div className="flex items-center justify-between text-xs">
//                                   <span className="text-gray-600 flex items-center gap-1">
//                                     <span>🧱</span>
//                                     Material:
//                                   </span>
//                                   <span className="font-medium text-gray-900 bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
//                                     {tile.tileMaterial}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       <div className="flex items-center gap-2 mt-2 flex-wrap">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(tile)}`}
//                         >
//                           {getStockStatusText(tile)}
//                         </span>
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             tile.qrCode
//                               ? "bg-green-100 text-green-800"
//                               : "bg-orange-100 text-orange-800"
//                           }`}
//                         >
//                           QR: {tile.qrCode ? "Yes" : "No"}
//                         </span>
//                         {tile.textureUrl && (
//                           <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                             Has Texture
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* PAGINATION COMPONENT - RESPONSIVE */}
//           {totalPages > 1 && (
//             <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4">
//               <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
//                 Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
//               </div>

//               <div className="flex items-center gap-2 order-1 sm:order-2">
//                 <button
//                   onClick={goToPreviousPage}
//                   disabled={currentPage === 1}
//                   className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                     currentPage === 1
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
//                   }`}
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                   <span className="hidden sm:inline">Previous</span>
//                 </button>

//                 <div className="flex items-center gap-1">
//                   {getPageNumbers().map((page, index) => {
//                     if (page === '...') {
//                       return (
//                         <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
//                           ...
//                         </span>
//                       );
//                     }
//                     return (
//                       <button
//                         key={page}
//                         onClick={() => goToPage(page as number)}
//                         className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all ${
//                           currentPage === page
//                             ? "bg-green-600 text-white shadow-md"
//                             : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <button
//                   onClick={goToNextPage}
//                   disabled={currentPage === totalPages}
//                   className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                     currentPage === totalPages
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
//                   }`}
//                 >
//                   <span className="hidden sm:inline">Next</span>
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* OTHER TABS */}
//       <div className="overflow-hidden">
//         {activeTab === "worker" && <WorkerManagement />}
//         {activeTab === "profile" && <SellerProfile />}
//         {activeTab === "excel" && <ExcelUpload onUploadComplete={loadData} />}
//         {activeTab === "stock-analytics" && <SellerStockAnalytics />}
//         {activeTab === "bulk" && <BulkUpload onUploadComplete={loadData} />}
//         {activeTab === "customer-inquiries" && <CustomerInquiriesManager />}
//         {activeTab === "qrcodes" && (
//           <QRCodeManager tiles={tiles} sellerId={currentUser?.user_id} onQRCodeGenerated={loadData} />
//         )}
//         {activeTab === "analytics" && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
//       </div>

//       {/* PAYMENT MODALS */}

//       <PlansModal
//         isOpen={showPlansModal}
//         onClose={() => setShowPlansModal(false)}
//         isLoggedIn={isAuthenticated}
//         onSelectPlan={handlePlanSelection}
//       />

//       <PaymentConfirmationModal
//         isOpen={showPaymentConfirmation}
//         onClose={() => {
//           setShowPaymentConfirmation(false);
//           setSelectedPlan(null);
//         }}
//         plan={selectedPlan}
//         onConfirm={handlePaymentConfirm}
//         isProcessing={processingPayment}
//       />

//       {checkoutOptions && paymentId && selectedPlan && (
//         <PaymentCheckout
//           checkoutOptions={checkoutOptions}
//           paymentId={paymentId}
//           planId={selectedPlan.id}
//           sellerId={currentUser?.user_id || ''} 
//           onSuccess={handlePaymentSuccess} 
//           onError={handlePaymentError}
//         />
//       )}
//     </div>
//   );
// }; 
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  Store,
  Package,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Loader,
  Search,
  Filter,
  Users,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Eye,
  TrendingUp,
  QrCode,
  Download,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Shield,
} from "lucide-react";
import { Tile } from "../types";
import { useAppStore } from "../stores/appStore";
import { BulkUpload } from "./BulkUpload";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { QRCodeManager } from "./QRCodeManager";
import { ExcelUpload } from "./ExcelUpload";
import { generateTileQRCode } from "../utils/qrCodeUtils";
import { SellerProfile } from "./SellerProfile";
import { WorkerManagement } from "./WorkerManagement";
import { SellerStockAnalytics } from "./SellerStockAnalytics";
import { CustomerInquiriesManager } from './CustomerInquiriesManager';
import { PlanStatusBanner } from './PlanStatusBanner';

// Payment System Imports
import { PlansModal } from './Payment/PlansModal';
import { PaymentConfirmationModal } from './Payment/PaymentConfirmationModal';
import { PaymentCheckout } from './Payment/PaymentCheckout';
import { initiatePayment } from '../lib/paymentService';
import { getPlanById } from '../lib/planService';
import type { Plan } from '../types/plan.types';
import type { RazorpayCheckoutOptions } from '../types/payment.types';
import { auth } from '../lib/firebase';
import { HistoryTab } from "./HistoryTab";
import {
  uploadTile,
  updateTile,
  deleteTile,
  getSellerProfile,
  getSellerTiles,
  updateTileQRCode,
  getTileById,
} from "../lib/firebaseutils";

import { uploadToCloudinary } from "../utils/cloudinaryUtils";
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { 
  getSellerSubscription, 
  isSubscriptionExpired,
  getDaysUntilExpiry 
} from "../lib/subscriptionService";

// ═══════════════════════════════════════════════════════════════
// ✅ INTERFACES
// ═══════════════════════════════════════════════════════════════

interface SellerPlanStatus {
  isActive: boolean;
  expiresAt: Date | null;
  planName: string | null;
  planId: string | null;
  daysRemaining: number;
  loading: boolean;
  lastChecked: Date | null;
}

// ═══════════════════════════════════════════════════════════════
// ✅ MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const SellerDashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAppStore();
  
  // Tab Management
  const [isAddingTile, setIsAddingTile] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "tiles"
    | "bulk"
    | "excel"
    | "analytics"
    | "qrcodes"
    | "profile"
    | "worker"
    | "scan"
    | "stock-analytics"
    | "customer-inquiries"
    | "history"
  >("tiles");

  // Tile Management
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
  const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [textureUploading, setTextureUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  
  // Mobile UI
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedTileId, setExpandedTileId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Payment State
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // ✅ PLAN STATUS STATE
  const [planStatus, setPlanStatus] = useState<SellerPlanStatus>({
    isActive: false,
    expiresAt: null,
    planName: null,
    planId: null,
    daysRemaining: 0,
    loading: true,
    lastChecked: null
  });

  // New Tile Form State
  const [newTile, setNewTile] = useState<Partial<Tile>>({
    name: "",
    category: "both",
    size: "",
    price: undefined,
    stock: 0,
    inStock: true,
    imageUrl: "",
    textureUrl: "",
    tileCode: "",
    tileSurface: "",
    tileMaterial: "",
  });

  // ═══════════════════════════════════════════════════════════════
  // ✅ PLAN STATUS CHECK FUNCTION
  // ═══════════════════════════════════════════════════════════════

  const checkSellerPlanStatus = async (sellerId: string): Promise<SellerPlanStatus> => {
    try {
      console.log('🔍 Checking plan status via subscriptionService:', sellerId);
      
      const subscription = await getSellerSubscription(sellerId, true);
      
      if (!subscription) {
        console.log('❌ No subscription found');
        return {
          isActive: false,
          expiresAt: null,
          planName: null,
          planId: null,
          daysRemaining: 0,
          loading: false,
          lastChecked: new Date()
        };
      }
      
      const expired = isSubscriptionExpired(subscription);
      const daysRemaining = getDaysUntilExpiry(subscription);
      const endDate = subscription.end_date ? new Date(subscription.end_date) : null;
      
      console.log('✅ Plan status checked:', {
        isActive: !expired,
        planName: subscription.plan_name,
        daysRemaining,
        expired
      });
      
      return {
        isActive: !expired,
        expiresAt: endDate,
        planName: subscription.plan_name || null,
        planId: subscription.plan_id || null,
        daysRemaining,
        loading: false,
        lastChecked: new Date()
      };
      
    } catch (error: any) {
      console.error('❌ Error checking plan status:', error);
      return {
        isActive: false,
        expiresAt: null,
        planName: null,
        planId: null,
        daysRemaining: 0,
        loading: false,
        lastChecked: new Date()
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ LOAD PLAN STATUS
  // ═══════════════════════════════════════════════════════════════

  const loadPlanStatus = async () => {
    if (!currentUser?.user_id) {
      console.log('⚠️ No user ID, skipping plan check');
      return;
    }

    try {
      console.log('🔄 Loading plan status...');
      const status = await checkSellerPlanStatus(currentUser.user_id);
      setPlanStatus(status);
      
      console.log('✅ Plan status loaded:', {
        isActive: status.isActive,
        planName: status.planName,
        daysRemaining: status.daysRemaining
      });
    } catch (error: any) {
      console.error('❌ Error loading plan status:', error);
      setPlanStatus({
        isActive: false,
        expiresAt: null,
        planName: null,
        planId: null,
        daysRemaining: 0,
        loading: false,
        lastChecked: new Date()
      });
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ HANDLE PLAN STATUS CHANGE FROM CHILD
  // ═══════════════════════════════════════════════════════════════

  const handlePlanStatusChange = async (isActive: boolean, isExpired: boolean) => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔔 PLAN STATUS CHANGE NOTIFICATION FROM CHILD');
    console.log('   isActive:', isActive);
    console.log('   isExpired:', isExpired);
    console.log('═══════════════════════════════════════════════════════');

    setPlanStatus(prev => ({
      ...prev,
      isActive,
      loading: false,
      lastChecked: new Date()
    }));

    console.log('✅ Parent state updated immediately');
    console.log('   Scan button will disable:', !isActive);
    console.log('   Worker button will disable:', !isActive);

    if (!isActive && isExpired) {
      console.log('🔄 Plan expired - Fetching full status in background...');
      setTimeout(async () => {
        await loadPlanStatus();
        console.log('✅ Background refresh complete');
      }, 1000);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ CHECK IF FEATURE IS ALLOWED
  // ═══════════════════════════════════════════════════════════════

  const isFeatureAllowed = (feature: 'scan' | 'worker' | 'analytics'): boolean => {
    if (planStatus.loading) {
      console.log(`⏳ Feature '${feature}' check: Loading...`);
      return false;
    }

    const allowed = planStatus.isActive;
    console.log(`🔍 Feature '${feature}' check: ${allowed ? 'ALLOWED' : 'BLOCKED'}`);
    return allowed;
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ GET DISABLED REASON MESSAGE
  // ═══════════════════════════════════════════════════════════════

  const getDisabledReason = (): string => {
    if (planStatus.loading) {
      return 'Checking plan status...';
    }

    if (!planStatus.isActive) {
      if (planStatus.expiresAt) {
        return `Your plan expired on ${planStatus.expiresAt.toLocaleDateString()}. Please renew to continue.`;
      }
      return 'No active plan. Please subscribe to access this feature.';
    }
    
    if (planStatus.daysRemaining <= 3) {
      return `Your plan expires in ${planStatus.daysRemaining} days. Consider renewing soon.`;
    }

    return '';
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ EFFECTS
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    console.log("🔍 SellerDashboard Auth Check:", {
      currentUser: currentUser?.email || "null",
      isAuthenticated,
      userRole: currentUser?.role || "null",
    });

    if (currentUser && isAuthenticated) {
      loadData();
      loadPlanStatus();
    } else if (currentUser === null && !isAuthenticated) {
      setLoading(false);
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    if (currentUser?.user_id && isAuthenticated && planRefreshTrigger > 0) {
      console.log('🔄 Plan refresh triggered, reloading plan status...');
      loadPlanStatus();
    }
  }, [planRefreshTrigger, currentUser?.user_id, isAuthenticated]);

  useEffect(() => {
    filterTiles();
    setCurrentPage(1);
  }, [tiles, searchTerm, categoryFilter, stockFilter]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ DATA LOADING
  // ═══════════════════════════════════════════════════════════════

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Loading seller data for:", currentUser?.email);

      const [profile, sellerTiles] = await Promise.all([
        getSellerProfile(currentUser?.user_id || ""),
        getSellerTiles(currentUser?.user_id || ""),
      ]);

      setSellerProfile(profile);

      if (sellerTiles && sellerTiles.length > 0) {
        const uniqueTilesMap = new Map();
        sellerTiles.forEach((tile) => {
          if (tile.id && !uniqueTilesMap.has(tile.id)) {
            uniqueTilesMap.set(tile.id, tile);
          }
        });

        const uniqueTiles = Array.from(uniqueTilesMap.values());

        console.log("✅ Seller data loaded:", {
          profile: profile?.business_name || "No profile",
          tilesRaw: sellerTiles.length,
          tilesUnique: uniqueTiles.length,
        });

        setTiles(uniqueTiles);
      } else {
        setTiles([]);
        console.log("ℹ️ No tiles found");
      }
    } catch (error: any) {
      console.error("❌ Error loading seller data:", error);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ FILTERING
  // ═══════════════════════════════════════════════════════════════

  const filterTiles = () => {
    let filtered = tiles;

    if (searchTerm) {
      filtered = filtered.filter(
        (tile) =>
          tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tile.tileCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tile.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tile.tileSurface?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tile.tileMaterial?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((tile) => tile.category === categoryFilter);
    }

    if (stockFilter === "in-stock") {
      filtered = filtered.filter((tile) => tile.inStock);
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter((tile) => !tile.inStock);
    }

    setFilteredTiles(filtered);
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ PAGINATION
  // ═══════════════════════════════════════════════════════════════

  const totalPages = Math.ceil(filteredTiles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTiles = filteredTiles.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ PAYMENT HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handlePlanSelection = async (planId: string) => {
    try {
      console.log('📦 Selected plan:', planId);
      
      if (!isAuthenticated) {
        console.log('🔐 User not authenticated');
        setShowPlansModal(false);
        setError('Please login to select a plan');
        return;
      }

      console.log('📋 Fetching plan details...');
      const plan = await getPlanById(planId);
      
      if (!plan) {
        setError('❌ Plan not found. Please try again.');
        return;
      }

      setSelectedPlan(plan);
      setShowPlansModal(false);
      setShowPaymentConfirmation(true);
      
    } catch (error: any) {
      console.error('❌ Error selecting plan:', error);
      setError(`❌ Error: ${error.message}`);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!selectedPlan) {
      setError('❌ No plan selected');
      return;
    }

    setProcessingPayment(true);

    try {
      console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

      const currentUserAuth = auth.currentUser;
      if (!currentUserAuth) {
        throw new Error('Please login first');
      }

      const result = await initiatePayment(
        selectedPlan.id,
        selectedPlan.plan_name,
        selectedPlan.price
      );

      if (!result.success || !result.checkoutOptions || !result.paymentId) {
        throw new Error(result.error || 'Failed to initiate payment');
      }

      console.log('✅ Payment initiated successfully');
      console.log('📝 Payment ID:', result.paymentId);

      setCheckoutOptions(result.checkoutOptions);
      setPaymentId(result.paymentId);
      setShowPaymentConfirmation(false);

    } catch (error: any) {
      console.error('❌ Payment initiation error:', error);
      setError(`❌ Payment Error: ${error.message}`);
      setProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 PAYMENT SUCCESS HANDLER STARTED');
    console.log('═══════════════════════════════════════════════════════');
    
    try {
      console.log('🔄 Step 1/8: Closing modals...');
      setCheckoutOptions(null);
      setPaymentId(null);
      setProcessingPayment(false);
      setSelectedPlan(null);
      setShowPaymentConfirmation(false);
      setShowPlansModal(false);
      console.log('✅ Modals closed');
      
      console.log('🔄 Step 2/8: Showing success message...');
      setSuccess('🎉 Payment successful! Activating plan...');
      console.log('✅ Success message shown');
      
      console.log('🔄 Step 3/8: Enabling workers (BEFORE refresh)...');
      try {
        const { enableAllSellersWorkers } = await import('../lib/firebaseutils');
        const result = await enableAllSellersWorkers(currentUser?.user_id || '');
        
        if (result.success && result.count > 0) {
          console.log(`✅ Enabled ${result.count} worker(s)`);
          setSuccess(`🎉 Plan activated! ${result.count} worker(s) enabled.`);
        } else {
          console.log('ℹ️ No workers to enable');
        }
      } catch (workerError: any) {
        console.warn('⚠️ Worker enable failed:', workerError);
      }
      console.log('✅ Worker enablement complete');
      
      console.log('🔄 Step 4/8: Waiting for Firestore (2s)...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Firestore wait complete');
      
      console.log('🔄 Step 5/8: Triggering refresh (NOW SAFE)...');
      setPlanRefreshTrigger(prev => prev + 1);
      console.log('✅ Refresh triggered');
      
      console.log('🔄 Step 6/8: UI sync (1s)...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ UI sync complete');
      
      console.log('🔄 Step 7/8: Reloading plan status...');
      await loadPlanStatus();
      console.log('✅ Plan status reloaded');
      
      console.log('🔄 Step 8/8: Reloading dashboard...');
      await loadData();
      console.log('✅ Dashboard reloaded');
      
      console.log('🎉 All steps complete!');
      setSuccess('✅ Plan activated! Workers can now login.');
      
      setTimeout(() => setSuccess(null), 7000);
      
      console.log('═══════════════════════════════════════════════════════');
      console.log('✅ PAYMENT SUCCESS HANDLER COMPLETED');
      console.log('═══════════════════════════════════════════════════════');
      
    } catch (error: any) {
      console.error('═══════════════════════════════════════════════════════');
      console.error('❌ ERROR:', error);
      console.error('═══════════════════════════════════════════════════════');
      setError('Payment successful but refresh failed. Reload page manually.');
    }
  };

  const handlePaymentError = async (error: string) => {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ PAYMENT ERROR:', error);
    console.error('═══════════════════════════════════════════════════════');
    
    setError(`❌ Payment Error: ${error}`);
    
    console.log('🧹 Cleaning up payment state...');
    setCheckoutOptions(null);
    setPaymentId(null);
    setProcessingPayment(false);
    setSelectedPlan(null);
    setShowPaymentConfirmation(false);
    console.log('✅ Payment state cleaned');
    
    setTimeout(async () => {
      console.log('🔄 Reloading plan status after error...');
      await loadPlanStatus();
      console.log('✅ Plan status check complete after error');
    }, 2000);
    
    console.log('═══════════════════════════════════════════════════════');
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ TILE MANAGEMENT FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  const generateTileCode = (): string => {
    const prefix =
      sellerProfile?.business_name?.substring(0, 3).toUpperCase() || "TIL";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const handleImageUpload = async (file: File, type: "image" | "texture") => {
    try {
      if (type === "image") {
        setImageUploading(true);
      } else {
        setTextureUploading(true);
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 5MB");
      }

      console.log(`🔄 Uploading ${type}:`, file.name);
      const imageUrl = await uploadToCloudinary(
        file,
        type === "image" ? "tiles/main" : "tiles/textures"
      );

      if (type === "image") {
        setNewTile((prev) => ({ ...prev, imageUrl }));
      } else {
        setNewTile((prev) => ({ ...prev, textureUrl: imageUrl }));
      }

      setSuccess(
        `${type === "image" ? "Image" : "Texture"} uploaded successfully`
      );
      console.log(`✅ ${type} uploaded:`, imageUrl);
    } catch (error: any) {
      console.error(`❌ ${type} upload failed:`, error);
      setError(error.message || `Failed to upload ${type}`);
    } finally {
      if (type === "image") {
        setImageUploading(false);
      } else {
        setTextureUploading(false);
      }
    }
  };

  const validateTileForm = (): string | null => {
    if (!newTile.name?.trim()) {
      return "❌ Tile Name is required. Please enter a tile name.";
    }

    if (!newTile.size?.trim()) {
      return "❌ Tile Size is required. Please enter or select a size (e.g., 60x60 cm).";
    }

    if (!newTile.price || newTile.price <= 0) {
      return "❌ Valid Price is required. Please enter a price greater than 0.";
    }

    if (newTile.stock === undefined || newTile.stock < 0) {
      return "❌ Valid Stock Quantity is required. Please enter stock (0 or more).";
    }

    if (!newTile.imageUrl?.trim()) {
      return "❌ Tile Image is required. Please upload an image before saving.";
    }

    return null;
  };

  const handleAddTile = async () => {
    try {
      setError(null);

      const validationError = validateTileForm();
      if (validationError) {
        setError(validationError);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          setError((prev) => (prev === validationError ? null : prev));
        }, 8000);
        return;
      }

      if (!currentUser) {
        setError("User not authenticated");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      console.log("🔄 Step 1/4: Preparing tile data...");

      const tileCode = newTile.tileCode || generateTileCode();

      const baseTileData = {
        ...newTile,
        sellerId: currentUser.user_id,
        showroomId: currentUser.user_id,
        tileCode: tileCode,
        inStock: (newTile.stock || 0) > 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("💾 Step 2/4: Saving tile to database...");

      const savedTile = await uploadTile(baseTileData);

      if (!savedTile || !savedTile.id) {
        throw new Error("Tile saved but ID not returned");
      }

      console.log("✅ Tile saved with ID:", savedTile.id);
      console.log("📱 Step 3/4: Generating QR code...");

      let qrCodeGenerated = false;
      try {
        const qrCodeDataUrl = await generateTileQRCode(savedTile);
        console.log("✅ QR code generated successfully");
        console.log("🔄 Step 4/4: Updating tile with QR code...");
        await updateTileQRCode(savedTile.id, qrCodeDataUrl);
        console.log("✅ Tile updated with QR code");
        qrCodeGenerated = true;
      } catch (qrError: any) {
        console.warn("⚠️ QR code generation failed:", qrError.message);
      }

      await loadData();

      setIsAddingTile(false);
      resetNewTile();

      if (qrCodeGenerated) {
        setSuccess("✅ Tile added successfully with QR code!");
      } else {
        setSuccess("✅ Tile added! QR code can be generated from QR Codes tab.");
      }

      console.log("🎉 Tile creation completed!");
    } catch (error: any) {
      console.error("❌ Tile creation failed:", error);
      setError(`Failed to add tile: ${error.message}`);
    }
  };

  const handleEditTile = async (tile: Tile) => {
    console.log("🔄 Editing tile:", tile.name);
    setEditingTile(tile);
    setNewTile({
      ...tile,
      stock: tile.stock || 0,
    });
    setIsAddingTile(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateTile = async () => {
    try {
      setError(null);

      const validationError = validateTileForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      if (!editingTile) {
        setError("No tile selected for editing");
        return;
      }

      console.log("🔄 Starting tile update:", editingTile.name);

      const updates = {
        ...newTile,
        inStock: (newTile.stock || 0) > 0,
        updatedAt: new Date().toISOString(),
      };

      console.log("💾 Updating tile in database...");
      await updateTile(editingTile.id, updates);
      console.log("✅ Tile updated in database");

      const criticalFieldsChanged =
        editingTile.name !== newTile.name ||
        editingTile.tileCode !== newTile.tileCode ||
        editingTile.price !== newTile.price ||
        editingTile.size !== newTile.size ||
        editingTile.category !== newTile.category;

      if (criticalFieldsChanged) {
        console.log("🔄 Critical fields changed, attempting QR regeneration...");

        setTimeout(async () => {
          try {
            if (typeof getTileById !== "function") {
              console.warn("⚠️ getTileById not available, skipping QR regeneration");
              return;
            }

            if (typeof generateTileQRCode !== "function") {
              console.warn("⚠️ generateTileQRCode not available, skipping QR regeneration");
              return;
            }

            if (typeof updateTileQRCode !== "function") {
              console.warn("⚠️ updateTileQRCode not available, skipping QR regeneration");
              return;
            }

            console.log("📱 Fetching updated tile data...");
            const updatedTileData = await getTileById(editingTile.id);

            if (!updatedTileData) {
              console.warn("⚠️ Could not fetch updated tile, skipping QR regeneration");
              return;
            }

            console.log("📱 Generating new QR code...");
            const newQRCode = await generateTileQRCode(updatedTileData);

            if (!newQRCode || !newQRCode.startsWith("data:image")) {
              console.warn("⚠️ Invalid QR code generated, skipping update");
              return;
            }

            console.log("💾 Updating QR code in database...");
            await updateTileQRCode(editingTile.id, newQRCode);

            console.log("✅ QR code regenerated successfully");

            await loadData();
          } catch (qrError: any) {
            console.error("⚠️ QR regeneration failed (non-critical):", qrError.message);
          }
        }, 0);
      } else {
        console.log("ℹ️ No critical fields changed, keeping existing QR code");
      }

      console.log("🔄 Reloading tiles list...");
      await loadData();

      setEditingTile(null);
      resetNewTile();

      setSuccess("Tile updated successfully!");
      console.log("✅ Tile update complete");
    } catch (error: any) {
      console.error("❌ Error updating tile:", error);
      setError(`Failed to update tile: ${error.message}`);
    }
  };

  const handleDeleteTile = async (tileId: string, tileName: string) => {
    if (!window.confirm(`Delete "${tileName}"?`)) return;

    try {
      setError(null);
      console.log("🔥 Deleting:", tileId);

      await deleteTile(tileId);

      console.log("✅ Deleted from database");

      await loadData();

      setSuccess("Tile deleted successfully");
    } catch (error: any) {
      console.error("❌ Delete failed:", error);
      setError(`Delete failed: ${error.message}`);
    }
  };

  const resetNewTile = () => {
    setNewTile({
      name: "",
      category: "both",
      size: "",
      price: 0,
      stock: 0,
      inStock: true,
      imageUrl: "",
      textureUrl: "",
      tileCode: "",
      tileSurface: "",
      tileMaterial: "",
    });
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
    setMobileMenuOpen(false);
    console.log("🎯 Switched to tab:", tab);
  };

  const getStockStatusColor = (tile: Tile) => {
    if (!tile.inStock) return "bg-red-100 text-red-800";
    if ((tile.stock || 0) < 10) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStockStatusText = (tile: Tile) => {
    if (!tile.inStock) return "Out of Stock";
    if ((tile.stock || 0) < 10) return "Low Stock";
    return "In Stock";
  };

  // ✅ Compute feature access
  const isScanAllowed = isFeatureAllowed('scan');
  const isWorkerAllowed = isFeatureAllowed('worker');
  const disabledMessage = getDisabledReason();

  // ═══════════════════════════════════════════════════════════════
  // ✅ RENDER GUARDS
  // ═══════════════════════════════════════════════════════════════

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Authentication Required
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
            Please log in to access the seller dashboard.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <User className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            User Profile Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
            Unable to load user profile. Please try logging in again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (currentUser.role !== "seller") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
            This dashboard is only accessible to sellers. Your role:{" "}
            <strong>{currentUser.role}</strong>
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 text-base sm:text-lg">
              Loading dashboard...
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 px-4">
              Loading data for {currentUser.full_name || currentUser.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ MAIN RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HEADER SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Store className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
                Seller Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {sellerProfile?.business_name || "Your Business"}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  {tiles.length} Total
                </span>
                <span className="flex items-center gap-1 text-green-600 whitespace-nowrap">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  {tiles.filter((t) => t.inStock).length} Stock
                </span>
                <span className="flex items-center gap-1 text-red-600 whitespace-nowrap">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  {tiles.filter((t) => !t.inStock).length} Out
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex-shrink-0 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* ✅ PLAN STATUS BANNER WITH CALLBACK */}
        <PlanStatusBanner 
          sellerId={currentUser?.user_id || ''} 
          onViewPlans={() => setShowPlansModal(true)}
          forceRefresh={planRefreshTrigger}
          onPlanStatusChange={handlePlanStatusChange}
        />

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* DESKTOP TABS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <div className="hidden lg:flex gap-2 flex-wrap">
          <button
            onClick={() => handleTabChange("tiles")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              activeTab === "tiles"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Edit className="w-4 h-4" />
            My Tiles
          </button>
          <button
  onClick={() => handleTabChange("history")}
  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
    activeTab === "history"
      ? "bg-green-600 text-white shadow-md"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`}
>
  <Clock className="w-4 h-4" />
  History
</button>
          <button
            onClick={() => isWorkerAllowed ? handleTabChange("worker") : setShowPlansModal(true)}
            disabled={!isWorkerAllowed}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium relative ${
              activeTab === "worker"
                ? "bg-green-600 text-white shadow-md"
                : !isWorkerAllowed
                ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title={!isWorkerAllowed ? disabledMessage : "Manage Workers"}
          >
            <User className="w-4 h-4" />
            Worker
            {!isWorkerAllowed && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>
          
          <button
            onClick={() => handleTabChange("customer-inquiries")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              activeTab === "customer-inquiries"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Users className="w-4 h-4" />
            Customers
          </button>
          
         
          
          <button
            onClick={() => isScanAllowed ? window.open("/scan", "_blank") : setShowPlansModal(true)}
            disabled={!isScanAllowed}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium shadow-md relative ${
              !isScanAllowed
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg"
            }`}
            title={!isScanAllowed ? disabledMessage : "Open QR Scanner"}
          >
            <QrCode className="w-4 h-4" />
            Scan
            {!isScanAllowed && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>
          
          <button
            onClick={() => handleTabChange("profile")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              activeTab === "profile"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          
          <button
            onClick={() => handleTabChange("excel")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              activeTab === "excel"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          
          <button
            onClick={() => handleTabChange("stock-analytics")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              activeTab === "stock-analytics"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Package className="w-4 h-4" />
            Stock Analytics
          </button>
          
          <button
            onClick={() => handleTabChange("bulk")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              activeTab === "bulk"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Upload className="w-4 h-4" />
            CSV
          </button>
          
          <button
            onClick={() => handleTabChange("qrcodes")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              activeTab === "qrcodes"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <QrCode className="w-4 h-4" />
            QR Codes
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MOBILE TABS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {mobileMenuOpen && (
          <div className="lg:hidden grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
            <button
              onClick={() => handleTabChange("tiles")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                activeTab === "tiles"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Edit className="w-4 h-4" />
              Tiles
            </button>
            
            <button
              onClick={() => handleTabChange("customer-inquiries")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                activeTab === "customer-inquiries"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Users className="w-4 h-4" />
              Customers
            </button>
            <button
  onClick={() => handleTabChange("history")}
  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
    activeTab === "history"
      ? "bg-green-600 text-white shadow-md"
      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
  }`}
>
  <Clock className="w-4 h-4" />
  History
</button>

            <button
              onClick={() => {
                if (isWorkerAllowed) {
                  handleTabChange("worker");
                } else {
                  setShowPlansModal(true);
                  setMobileMenuOpen(false);
                }
              }}
              disabled={!isWorkerAllowed}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium relative ${
                activeTab === "worker"
                  ? "bg-green-600 text-white shadow-md"
                  : !isWorkerAllowed
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60 border border-gray-300"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
              title={!isWorkerAllowed ? "Plan expired - Click to renew" : undefined}
            >
              <User className="w-4 h-4" />
              Worker
              {!isWorkerAllowed && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            
            <button
              onClick={() => {
                setShowPlansModal(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 text-sm font-medium shadow-md"
            >
              <Eye className="w-4 h-4" />
              Plans
            </button>
            
            <button
              onClick={() => {
                if (isScanAllowed) {
                  window.open("/scan", "_blank");
                } else {
                  setShowPlansModal(true);
                  setMobileMenuOpen(false);
                }
              }}
              disabled={!isScanAllowed}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium shadow-md relative ${
                !isScanAllowed
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
              title={!isScanAllowed ? "Plan expired - Click to renew" : undefined}
            >
              <QrCode className="w-4 h-4" />
              Scan
              {!isScanAllowed && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            
            <button
              onClick={() => handleTabChange("profile")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                activeTab === "profile"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            
            <button
              onClick={() => handleTabChange("excel")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                activeTab === "excel"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            
            <button
              onClick={() => handleTabChange("stock-analytics")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                activeTab === "stock-analytics"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Package className="w-4 h-4" />
              Stock
            </button>
            
            <button
              onClick={() => handleTabChange("bulk")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                activeTab === "bulk"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Upload className="w-4 h-4" />
              CSV
            </button>
            
            <button
              onClick={() => handleTabChange("qrcodes")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                activeTab === "qrcodes"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PLAN EXPIRY ALERTS */}
      {/* ═══════════════════════════════════════════════════════════════ */}


    

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ALERT MESSAGES */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-red-800 font-medium text-sm sm:text-base">
              Error
            </p>
            <p className="text-red-700 text-xs sm:text-sm break-words">
              {error}
            </p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 font-bold text-lg flex-shrink-0 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3 animate-slide-down">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-green-800 font-medium text-sm sm:text-base">
              Success
            </p>
            <p className="text-green-700 text-xs sm:text-sm break-words">
              {success}
            </p>
          </div>
          <button
            onClick={() => setSuccess(null)}
            className="text-green-400 hover:text-green-600 font-bold text-lg flex-shrink-0 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TILES TAB CONTENT - COMPLETE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === "tiles" && (
        <>
          {/* Controls - Responsive */}
          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tiles by name, code, size, surface, material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full text-sm sm:text-base transition-shadow"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white cursor-pointer transition-shadow"
              >
                <option value="all">All Categories</option>
                <option value="floor">Floor Only</option>
                <option value="wall">Wall Only</option>
                <option value="both">Floor & Wall</option>
              </select>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white cursor-pointer transition-shadow"
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>

              <button
                onClick={loadData}
                className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={() => {
                  setIsAddingTile(true);
                  setEditingTile(null);
                  resetNewTile();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add New Tile
              </button>
            </div>

            {/* Results Summary with Pagination Info */}
            <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center justify-between gap-2">
              <div>
                Showing {currentTiles.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
                {searchTerm && (
                  <span className="font-medium"> matching "{searchTerm}"</span>
                )}
              </div>
              {totalPages > 1 && (
                <div className="text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ADD/EDIT TILE FORM - COMPLETE */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          {(isAddingTile || editingTile) && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6 border-2 border-dashed border-green-300 rounded-xl bg-green-50">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                {editingTile ? (
                  <>
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span className="truncate">Edit: {editingTile.name}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    Add New Tile
                  </>
                )}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Tile Name */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Tile Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tile name"
                    value={newTile.name}
                    onChange={(e) =>
                      setNewTile({ ...newTile, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
                  />
                </div>

                {/* Tile Code */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Tile Code
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={newTile.tileCode}
                    onChange={(e) =>
                      setNewTile({ ...newTile, tileCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    value={newTile.category}
                    onChange={(e) =>
                      setNewTile({
                        ...newTile,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white cursor-pointer transition-shadow"
                  >
                    <option value="floor">Floor Only</option>
                    <option value="wall">Wall Only</option>
                    <option value="both">Floor & Wall</option>
                  </select>
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <label
                    htmlFor="tile-size-select"
                    className="block text-xs sm:text-sm font-medium text-gray-700"
                  >
                    Size *
                  </label>
                  <div className="relative">
                    <select
                      id="tile-size-select"
                      name="size"
                      value={newTile.size}
                      onChange={(e) => {
                        console.log("Size selected:", e.target.value);
                        setNewTile({ ...newTile, size: e.target.value });
                      }}
                      onFocus={(e) => {
                        e.target.click();
                      }}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        touchAction: "manipulation",
                      }}
                    >
                      <option value="">Select Tile Size</option>
                      <option value="30x30 cm">30x30 cm</option>
                      <option value="30x60 cm">30x60 cm</option>
                      <option value="60x60 cm">60x60 cm</option>
                      <option value="60x120 cm">60x120 cm</option>
                      <option value="80x80 cm">80x80 cm</option>
                      <option value="40x40 cm">40x40 cm</option>
                      <option value="40x60 cm">40x60 cm</option>
                      <option value="50x50 cm">50x50 cm</option>
                      <option value="20x120 cm">20x120 cm</option>
                      <option value="15x90 cm">15x90 cm</option>
                      <option value="10x30 cm">10x30 cm</option>
                      <option value="20x20 cm">20x20 cm</option>
                      <option value="25x40 cm">25x40 cm</option>
                      <option value="61x122 cm">61x122 cm</option>
                      <option value="122x122 cm">122x122 cm</option>
                      <option value="75x75 cm">75x75 cm</option>
                      <option value="100x100 cm">100x100 cm</option>
                      <option value="45x45 cm">45x45 cm</option>
                      <option value="7.5x15 cm">7.5x15 cm</option>
                      <option value="6x25 cm">6x25 cm</option>
                    </select>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {newTile.size && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Selected: {newTile.size}</span>
                    </div>
                  )}
                </div>

                {/* Tile Surface */}
                <div className="space-y-2">
                  <label
                    htmlFor="tile-surface-select"
                    className="block text-xs sm:text-sm font-medium text-gray-700"
                  >
                    Tile Surface
                  </label>
                  <div className="relative">
                    <select
                      id="tile-surface-select"
                      name="tileSurface"
                      value={newTile.tileSurface || ""}
                      onChange={(e) => {
                        console.log("Surface selected:", e.target.value);
                        setNewTile({
                          ...newTile,
                          tileSurface: e.target.value || undefined,
                        });
                      }}
                      onFocus={(e) => {
                        e.target.click();
                      }}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        touchAction: "manipulation",
                      }}
                    >
                      <option value="">Select Surface Finish</option>
                      <option value="Polished">Polished</option>
                      <option value="Step Side">Step Side</option>
                      <option value="Matt">Matt</option>
                      <option value="Carving">Carving</option>
                      <option value="High Gloss">High Gloss</option>
                      <option value="Metallic">Metallic</option>
                      <option value="Sugar">Sugar</option>
                      <option value="Glue">Glue</option>
                      <option value="Punch">Punch</option>
                    </select>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {newTile.tileSurface && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Selected: {newTile.tileSurface}</span>
                    </div>
                  )}
                </div>

                {/* Tile Material */}
                <div className="space-y-2">
                  <label
                    htmlFor="tile-material-select"
                    className="block text-xs sm:text-sm font-medium text-gray-700"
                  >
                    Tile Material
                  </label>
                  <div className="relative">
                    <select
                      id="tile-material-select"
                      name="tileMaterial"
                      value={newTile.tileMaterial || ""}
                      onChange={(e) => {
                        console.log("Material selected:", e.target.value);
                        setNewTile({
                          ...newTile,
                          tileMaterial: e.target.value || undefined,
                        });
                      }}
                      onFocus={(e) => {
                        e.target.click();
                      }}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer active:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] pr-10"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        touchAction: "manipulation",
                      }}
                    >
                      <option value="">Select Material Type</option>
                      <option value="Slabs">Slabs</option>
                      <option value="GVT & PGVT">GVT & PGVT</option>
                      <option value="Double Charge">Double Charge</option>
                      <option value="Counter Tops">Counter Tops</option>
                      <option value="Full Body">Full Body</option>
                      <option value="Ceramic">Ceramic</option>
                      <option value="Mosaic">Mosaic</option>
                      <option value="Subway">Subway</option>
                    </select>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {newTile.tileMaterial && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Selected: {newTile.tileMaterial}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={newTile.price || ""}
                    onChange={(e) =>
                      setNewTile({
                        ...newTile,
                        price:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter stock quantity"
                    value={newTile.stock || ""}
                    onChange={(e) =>
                      setNewTile({
                        ...newTile,
                        stock:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
                    min="0"
                  />
                </div>

                {/* Main Image Upload */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Tile Image *
                  </label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "image");
                      }}
                      className="hidden"
                      id="tile-image-upload"
                    />
                    <label
                      htmlFor="tile-image-upload"
                      className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium ${
                        imageUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {imageUploading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Choose Image
                        </>
                      )}
                    </label>
                    {newTile.imageUrl && (
                      <div className="flex items-center gap-2">
                        <img
                          src={newTile.imageUrl}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Uploaded</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Texture Image Upload */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Texture (Optional)
                  </label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "texture");
                      }}
                      className="hidden"
                      id="texture-image-upload"
                    />
                    <label
                      htmlFor="texture-image-upload"
                      className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium ${
                        textureUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {textureUploading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Choose Texture
                        </>
                      )}
                    </label>
                    {newTile.textureUrl && (
                      <div className="flex items-center gap-2">
                        <img
                          src={newTile.textureUrl}
                          alt="Texture"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Uploaded</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6">
                <button
                  onClick={editingTile ? handleUpdateTile : handleAddTile}
                  disabled={imageUploading || textureUploading}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Save className="w-4 h-4" />
                  {editingTile ? "Update Tile" : "Save Tile"}
                </button>
                <button
                  onClick={() => {
                    setIsAddingTile(false);
                    setEditingTile(null);
                    resetNewTile();
                    setError(null);
                  }}
                  className="px-4 sm:px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* DESKTOP TABLE VIEW - COMPLETE */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Image</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Code</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Category</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Surface</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Material</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Price</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Stock</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">QR</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentTiles.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center p-8 text-gray-500">
                      {tiles.length === 0 ? (
                        <div className="space-y-2">
                          <Package className="w-12 h-12 text-gray-300 mx-auto" />
                          <p className="font-medium">No tiles found</p>
                          <p className="text-sm">Start by adding your first tile!</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Search className="w-12 h-12 text-gray-300 mx-auto" />
                          <p className="font-medium">No tiles match your search</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  currentTiles.map((tile) => (
                    <tr
                      key={tile.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <img
                          src={tile.imageUrl}
                          alt={tile.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-tile.png";
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{tile.name}</div>
                          {tile.textureUrl && (
                            <div className="text-xs text-green-600">Has texture</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-xs text-gray-600 font-mono">{tile.tileCode}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tile.category === "floor"
                              ? "bg-blue-100 text-blue-800"
                              : tile.category === "wall"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tile.category === "both"
                            ? "Both"
                            : tile.category.charAt(0).toUpperCase() + tile.category.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 text-sm">{tile.size}</td>
                      <td className="p-3 text-xs sm:text-sm">
                        {tile.tileSurface ? (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                            <span>🔘</span>
                            <span>{tile.tileSurface}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="p-3 text-xs sm:text-sm">
                        {tile.tileMaterial ? (
                          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
                            <span>🧱</span>
                            <span>{tile.tileMaterial}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-gray-900 text-sm">
                        ₹{tile.price.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div className="font-medium">{tile.stock || 0}</div>
                          {(tile.stock || 0) < 10 && tile.inStock && (
                            <div className="text-xs text-orange-600">Low</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(tile)}`}
                        >
                          {getStockStatusText(tile)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tile.qrCode
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {tile.qrCode ? "✓" : "○"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTile(tile)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTile(tile.id, tile.name)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* MOBILE/TABLET CARD VIEW - COMPLETE */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          <div className="lg:hidden space-y-3">
            {currentTiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {tiles.length === 0 ? (
                  <div className="space-y-2">
                    <Package className="w-16 h-16 text-gray-300 mx-auto" />
                    <p className="font-medium">No tiles found</p>
                    <p className="text-sm">Start by adding your first tile!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Search className="w-16 h-16 text-gray-300 mx-auto" />
                    <p className="font-medium">No tiles match your search</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            ) : (
              currentTiles.map((tile) => (
                <div
                  key={tile.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src={tile.imageUrl}
                        alt={tile.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-tile.png";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {tile.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono">{tile.tileCode}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleEditTile(tile)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTile(tile.id, tile.name)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <div className="mt-0.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                tile.category === "floor"
                                  ? "bg-blue-100 text-blue-800"
                                  : tile.category === "wall"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {tile.category === "both" ? "Both" : tile.category}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <div className="font-medium text-gray-900">{tile.size}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <div className="font-semibold text-gray-900">
                            ₹{tile.price.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <div className="font-medium text-gray-900">
                            {tile.stock || 0}
                            {(tile.stock || 0) < 10 && tile.inStock && (
                              <span className="text-orange-600 ml-1">(Low)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {(tile.tileSurface || tile.tileMaterial) && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                          <button
                            onClick={() =>
                              setExpandedTileId(expandedTileId === tile.id ? null : tile.id)
                            }
                            className="w-full flex items-center justify-between text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5" />
                              Tile Specifications
                            </span>
                            {expandedTileId === tile.id ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </button>

                          {expandedTileId === tile.id && (
                            <div className="mt-2 space-y-2 animate-slide-down">
                              {tile.tileSurface && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <span>🔘</span>
                                    Surface:
                                  </span>
                                  <span className="font-medium text-gray-900 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                    {tile.tileSurface}
                                  </span>
                                </div>
                              )}
                              {tile.tileMaterial && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <span>🧱</span>
                                    Material:
                                  </span>
                                  <span className="font-medium text-gray-900 bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                                    {tile.tileMaterial}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(tile)}`}
                        >
                          {getStockStatusText(tile)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tile.qrCode
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          QR: {tile.qrCode ? "Yes" : "No"}
                        </span>
                        {tile.textureUrl && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Has Texture
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PAGINATION COMPONENT - RESPONSIVE */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4">
              <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
              </div>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page as number)}
                        className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? "bg-green-600 text-white shadow-md"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* OTHER TABS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <div className="overflow-hidden">
        {activeTab === "worker" && <WorkerManagement />}
        {activeTab === "profile" && <SellerProfile />}
        {activeTab === "excel" && <ExcelUpload onUploadComplete={loadData} />}
        {activeTab === "stock-analytics" && <SellerStockAnalytics />}
        {activeTab === "bulk" && <BulkUpload onUploadComplete={loadData} />}
        {activeTab === "customer-inquiries" && <CustomerInquiriesManager />}
        {activeTab === "qrcodes" && (
          <QRCodeManager tiles={tiles} sellerId={currentUser?.user_id} onQRCodeGenerated={loadData} />
        )}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "analytics" && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PAYMENT MODALS */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <PlansModal
        isOpen={showPlansModal}
        onClose={() => setShowPlansModal(false)}
        isLoggedIn={isAuthenticated}
        onSelectPlan={handlePlanSelection}
      />

      <PaymentConfirmationModal
        isOpen={showPaymentConfirmation}
        onClose={() => {
          setShowPaymentConfirmation(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        onConfirm={handlePaymentConfirm}
        isProcessing={processingPayment}
      />

      {checkoutOptions && paymentId && selectedPlan && (
        <PaymentCheckout
          checkoutOptions={checkoutOptions}
          paymentId={paymentId}
          planId={selectedPlan.id}
          sellerId={currentUser?.user_id || ''} 
          onSuccess={handlePaymentSuccess} 
          onError={handlePaymentError}
        />
      )}
    </div>
  );
};

console.log('✅ SellerDashboard loaded - PRODUCTION v8.0 - COMPLETE');
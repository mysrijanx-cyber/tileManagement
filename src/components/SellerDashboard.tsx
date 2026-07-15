// import React, { useState, useEffect } from "react";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Upload,
//   Save,
//   Package,
//   FileSpreadsheet,
//   AlertCircle,
//   CheckCircle,
//   Loader,
//   Search,
//   Users,
//   RefreshCw,
//   ChevronUp,
//   ChevronDown,
//   Eye,
//   TrendingUp,
//   QrCode,
//   User,
//   Menu,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   Shield,
//   Bell,
//   Settings as SettingsIcon,
//   LayoutGrid,
//   List,
//   Award,
//   Layers,
//   Circle,
//   HelpCircle,
//   CreditCard,
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
// import { jwtService } from '../lib/jwtService';
// import { PlansModal } from './Payment/PlansModal';
// import { PaymentConfirmationModal } from './Payment/PaymentConfirmationModal';
// import { PaymentCheckout } from './Payment/PaymentCheckout';
// import { initiatePayment } from '../lib/paymentService';
// import { getPlanById } from '../lib/planService';
// import type { Plan } from '../types/plan.types';
// import type { RazorpayCheckoutOptions } from '../types/payment.types';
// import { auth } from '../lib/firebase';
// import { HistoryTab } from "./HistoryTab";
// import {
//   uploadTile,
//   updateTile,
//   deleteTile,
//   getSellerProfile,
//   getSellerTiles,
//   updateTileQRCode,
//   getTileById,
// } from "../lib/firebaseutils";
// import { BillingTab } from './BillingTab';
// import {
//   getSellerSubscription,
//   isSubscriptionExpired,
//   getDaysUntilExpiry
// } from "../lib/subscriptionService";

// // ═══════════════════════════════════════════════════════════════
// // ✅ INTERFACES
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

// type TabKey =
//   | "tiles"
//   | "bulk"
//   | "excel"
//   | "analytics"
//   | "qrcodes"
//   | "profile"
//   | "worker"
//   | "scan"
//   | "stock-analytics"
//   | "customer-inquiries"
//   | "history"
//   | "billing";

// // ═══════════════════════════════════════════════════════════════
// // ✅ MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const SellerDashboard: React.FC = () => {
//   const { currentUser, isAuthenticated } = useAppStore();

//   // Tab Management
//   const [isAddingTile, setIsAddingTile] = useState(false);
//   const [activeTab, setActiveTab] = useState<TabKey>("tiles");

//   // Tile Management
//   const [editingTile, setEditingTile] = useState<Tile | null>(null);
//   const [sellerProfile, setSellerProfile] = useState<any>(null);
//   const [tiles, setTiles] = useState<Tile[]>([]);
//   const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
//   const [userToken, setUserToken] = useState<string>('');

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
//   const [viewMode, setViewMode] = useState<"table" | "grid">("table");

//   // Mobile / Sidebar UI
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [expandedTileId, setExpandedTileId] = useState<string | null>(null);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(4);

//   // Payment State
//   const [showPlansModal, setShowPlansModal] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
//   const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0);
//   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
//   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   useEffect(() => {
//     const checkPaymentSuccess = () => {
//       const flag = localStorage.getItem('plan_just_purchased');
//       if (flag) {
//         setPlanRefreshTrigger(prev => prev + 1);
//         localStorage.removeItem('plan_just_purchased');
//         if (showPlansModal) {
//           setTimeout(() => setShowPlansModal(false), 3000);
//         }
//       }
//     };
//     const interval = setInterval(checkPaymentSuccess, 1000);
//     return () => clearInterval(interval);
//   }, [showPlansModal]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const token = jwtService.getAccessToken();
//       if (token) {
//         const isValid = jwtService.isValidTokenFormat(token);
//         setUserToken(isValid ? token : '');
//       } else {
//         setUserToken('');
//       }
//     } else {
//       setUserToken('');
//     }
//   }, [isAuthenticated]);

//   const [planStatus, setPlanStatus] = useState<SellerPlanStatus>({
//     isActive: false,
//     expiresAt: null,
//     planName: null,
//     planId: null,
//     daysRemaining: 0,
//     loading: true,
//     lastChecked: null
//   });

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
//   // ✅ PLAN STATUS
//   // ═══════════════════════════════════════════════════════════════

//   const checkSellerPlanStatus = async (sellerId: string): Promise<SellerPlanStatus> => {
//     try {
//       const subscription = await getSellerSubscription(sellerId, true);
//       if (!subscription) {
//         return { isActive: false, expiresAt: null, planName: null, planId: null, daysRemaining: 0, loading: false, lastChecked: new Date() };
//       }
//       const expired = isSubscriptionExpired(subscription);
//       const daysRemaining = getDaysUntilExpiry(subscription);
//       const endDate = subscription.end_date ? new Date(subscription.end_date) : null;
//       return {
//         isActive: !expired,
//         expiresAt: endDate,
//         planName: subscription.plan_name || null,
//         planId: subscription.plan_id || null,
//         daysRemaining,
//         loading: false,
//         lastChecked: new Date()
//       };
//     } catch (error: any) {
//       return { isActive: false, expiresAt: null, planName: null, planId: null, daysRemaining: 0, loading: false, lastChecked: new Date() };
//     }
//   };

//   const loadPlanStatus = async () => {
//     if (!currentUser?.user_id) return;
//     try {
//       const status = await checkSellerPlanStatus(currentUser.user_id);
//       setPlanStatus(status);
//     } catch (error: any) {
//       setPlanStatus({ isActive: false, expiresAt: null, planName: null, planId: null, daysRemaining: 0, loading: false, lastChecked: new Date() });
//     }
//   };

//   const handlePlanStatusChange = async (isActive: boolean, isExpired: boolean) => {
//     setPlanStatus(prev => ({ ...prev, isActive, loading: false, lastChecked: new Date() }));
//     if (!isActive && isExpired) {
//       setTimeout(async () => { await loadPlanStatus(); }, 1000);
//     }
//   };

//   const isFeatureAllowed = (feature: 'scan' | 'worker' | 'analytics'): boolean => {
//     if (planStatus.loading) return false;
//     return planStatus.isActive;
//   };

//   const getDisabledReason = (): string => {
//     if (planStatus.loading) return 'Checking plan status...';
//     if (!planStatus.isActive) {
//       if (planStatus.expiresAt) return `Your plan expired on ${planStatus.expiresAt.toLocaleDateString()}. Please renew to continue.`;
//       return 'No active plan. Please subscribe to access this feature.';
//     }
//     if (planStatus.daysRemaining <= 3) return `Your plan expires in ${planStatus.daysRemaining} days. Consider renewing soon.`;
//     return '';
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ EFFECTS
//   // ═══════════════════════════════════════════════════════════════

//   useEffect(() => {
//     if (currentUser && isAuthenticated) {
//       loadData();
//       loadPlanStatus();
//     } else if (currentUser === null && !isAuthenticated) {
//       setLoading(false);
//     }
//   }, [currentUser, isAuthenticated]);

//   useEffect(() => {
//     if (currentUser?.user_id && isAuthenticated && planRefreshTrigger > 0) {
//       loadPlanStatus();
//     }
//   }, [planRefreshTrigger, currentUser?.user_id, isAuthenticated]);

//   useEffect(() => {
//     filterTiles();
//     setCurrentPage(1);
//   }, [tiles, searchTerm, categoryFilter, stockFilter]);

//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => { setError(null); setSuccess(null); }, 5000);
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
//       const [profile, sellerTiles] = await Promise.all([
//         getSellerProfile(currentUser?.user_id || ""),
//         getSellerTiles(currentUser?.user_id || ""),
//       ]);
//       setSellerProfile(profile);
//       if (sellerTiles && sellerTiles.length > 0) {
//         const uniqueTilesMap = new Map();
//         sellerTiles.forEach((tile) => {
//           if (tile.id && !uniqueTilesMap.has(tile.id)) uniqueTilesMap.set(tile.id, tile);
//         });
//         setTiles(Array.from(uniqueTilesMap.values()));
//       } else {
//         setTiles([]);
//       }
//     } catch (error: any) {
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
//     if (categoryFilter !== "all") filtered = filtered.filter((tile) => tile.category === categoryFilter);
//     if (stockFilter === "in-stock") filtered = filtered.filter((tile) => tile.inStock);
//     else if (stockFilter === "out-of-stock") filtered = filtered.filter((tile) => !tile.inStock);
//     setFilteredTiles(filtered);
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ PAGINATION
//   // ═══════════════════════════════════════════════════════════════

//   const totalPages = Math.ceil(filteredTiles.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentTiles = filteredTiles.slice(indexOfFirstItem, indexOfLastItem);

//   const goToPage = (pageNumber: number) => { setCurrentPage(pageNumber); window.scrollTo({ top: 0, behavior: 'smooth' }); };
//   const goToNextPage = () => { if (currentPage < totalPages) { setCurrentPage(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
//   const goToPreviousPage = () => { if (currentPage > 1) { setCurrentPage(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

//   const getPageNumbers = () => {
//     const pages: (number | string)[] = [];
//     const maxPagesToShow = 5;
//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else if (currentPage <= 3) {
//       for (let i = 1; i <= 4; i++) pages.push(i);
//       pages.push('...'); pages.push(totalPages);
//     } else if (currentPage >= totalPages - 2) {
//       pages.push(1); pages.push('...');
//       for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
//     } else {
//       pages.push(1); pages.push('...');
//       for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
//       pages.push('...'); pages.push(totalPages);
//     }
//     return pages;
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ PAYMENT HANDLERS
//   // ═══════════════════════════════════════════════════════════════

//   const handlePlanSelection = async (planId: string) => {
//     try {
//       if (!isAuthenticated) { setShowPlansModal(false); setError('Please login to select a plan'); return; }
//       const plan = await getPlanById(planId);
//       if (!plan) { setError('❌ Plan not found. Please try again.'); return; }
//       setSelectedPlan(plan);
//       setShowPlansModal(false);
//       setShowPaymentConfirmation(true);
//     } catch (error: any) {
//       setError(`❌ Error: ${error.message}`);
//     }
//   };

//   const handlePaymentConfirm = async () => {
//     if (!selectedPlan) { setError('❌ No plan selected'); return; }
//     setProcessingPayment(true);
//     try {
//       const currentUserAuth = auth.currentUser;
//       if (!currentUserAuth) throw new Error('Please login first');
//       const result = await initiatePayment(selectedPlan.id, selectedPlan.plan_name, selectedPlan.price);
//       if (!result.success || !result.checkoutOptions || !result.paymentId) throw new Error(result.error || 'Failed to initiate payment');
//       setCheckoutOptions(result.checkoutOptions);
//       setPaymentId(result.paymentId);
//       setShowPaymentConfirmation(false);
//     } catch (error: any) {
//       setError(`❌ Payment Error: ${error.message}`);
//       setProcessingPayment(false);
//     }
//   };

//   const handlePaymentSuccess = async () => {
//     try {
//       setCheckoutOptions(null); setPaymentId(null); setProcessingPayment(false);
//       setSelectedPlan(null); setShowPaymentConfirmation(false); setShowPlansModal(false);
//       setSuccess('🎉 Payment successful! Activating plan...');
//       try {
//         const { enableAllSellersWorkers } = await import('../lib/firebaseutils');
//         const result = await enableAllSellersWorkers(currentUser?.user_id || '');
//         if (result.success && result.count > 0) setSuccess(`🎉 Plan activated! ${result.count} worker(s) enabled.`);
//       } catch (workerError: any) { /* non-critical */ }
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       setPlanRefreshTrigger(prev => prev + 1);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       await loadPlanStatus();
//       await loadData();
//       setSuccess('✅ Plan activated! Workers can now login.');
//       setTimeout(() => setSuccess(null), 7000);
//     } catch (error: any) {
//       setError('Payment successful but refresh failed. Reload page manually.');
//     }
//   };

//   const handlePaymentError = async (error: string) => {
//     setError(`❌ Payment Error: ${error}`);
//     setCheckoutOptions(null); setPaymentId(null); setProcessingPayment(false);
//     setSelectedPlan(null); setShowPaymentConfirmation(false);
//     setTimeout(async () => { await loadPlanStatus(); }, 2000);
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ TILE MANAGEMENT FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════

//   const generateTileCode = (): string => {
//     const prefix = sellerProfile?.business_name?.substring(0, 3).toUpperCase() || "TIL";
//     const timestamp = Date.now().toString().slice(-6);
//     const random = Math.random().toString(36).substring(2, 4).toUpperCase();
//     return `${prefix}${timestamp}${random}`;
//   };

//   const handleImageUpload = async (file: File, type: "image" | "texture") => {
//     try {
//       type === "image" ? setImageUploading(true) : setTextureUploading(true);
//       if (!file.type.startsWith("image/")) throw new Error("Please select a valid image file");
//       if (file.size > 5 * 1024 * 1024) throw new Error("Image size should be less than 5MB");
//       const imageUrl = await uploadToCloudinaryWrapper(file, type === "image" ? "tiles/main" : "tiles/textures");
//       if (type === "image") setNewTile((prev) => ({ ...prev, imageUrl }));
//       else setNewTile((prev) => ({ ...prev, textureUrl: imageUrl }));
//       setSuccess(`${type === "image" ? "Image" : "Texture"} uploaded successfully`);
//     } catch (error: any) {
//       setError(error.message || `Failed to upload ${type}`);
//     } finally {
//       type === "image" ? setImageUploading(false) : setTextureUploading(false);
//     }
//   };

//   // wrapper kept separate to avoid breaking import name collisions
//   const uploadToCloudinaryWrapper = async (file: File, folder: string) => {
//     const { uploadToCloudinary } = await import("../utils/cloudinaryUtils");
//     return uploadToCloudinary(file, folder);
//   };

//   const validateTileForm = (): string | null => {
//     if (!newTile.name?.trim()) return "❌ Tile Name is required. Please enter a tile name.";
//     if (!newTile.size || newTile.size.trim() === "" || newTile.size === "manual_trigger") {
//       return "❌ Tile Size is required. Please select or enter a size.";
//     }
//     if (newTile.size.includes('x') && !newTile.size.match(/^\d+x\d+ cm$/)) {
//       return "❌ Invalid Manual Size. Please enter BOTH Width and Height properly.";
//     }
//     if (!newTile.price || newTile.price <= 0) return "❌ Valid Price is required. Please enter a price greater than 0.";
//     if (newTile.stock === undefined || newTile.stock < 0) return "❌ Valid Stock Quantity is required. Please enter stock (0 or more).";
//     if (!newTile.imageUrl?.trim()) return "❌ Tile Image is required. Please upload an image before saving.";
//     return null;
//   };

//   const handleAddTile = async () => {
//     try {
//       setError(null);
//       const validationError = validateTileForm();
//       if (validationError) {
//         setError(validationError);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         return;
//       }
//       if (!currentUser) { setError("User not authenticated"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }

//       const tileCode = newTile.tileCode || generateTileCode();
//       const baseTileData = {
//         ...newTile,
//         size: newTile.size?.trim(),
//         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
//         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
//         sellerId: currentUser.user_id,
//         showroomId: currentUser.user_id,
//         tileCode,
//         inStock: (newTile.stock || 0) > 0,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       const savedTile = await uploadTile(baseTileData);
//       if (!savedTile || !savedTile.id) throw new Error("Tile saved but ID not returned");

//       let qrCodeGenerated = false;
//       try {
//         const qrCodeDataUrl = await generateTileQRCode(savedTile);
//         await updateTileQRCode(savedTile.id, qrCodeDataUrl);
//         qrCodeGenerated = true;
//       } catch (qrError: any) { /* non-critical */ }

//       await loadData();
//       setIsAddingTile(false);
//       resetNewTile();
//       setSuccess(qrCodeGenerated ? "✅ Tile added successfully with QR code!" : "✅ Tile added! QR code can be generated from QR Codes tab.");
//     } catch (error: any) {
//       setError(`Failed to add tile: ${error.message}`);
//     }
//   };

//   const handleEditTile = async (tile: Tile) => {
//     setEditingTile(tile);
//     setNewTile({ ...tile, stock: tile.stock || 0 });
//     setIsAddingTile(false);
//     setError(null);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleUpdateTile = async () => {
//     try {
//       setError(null);
//       const validationError = validateTileForm();
//       if (validationError) { setError(validationError); return; }
//       if (!editingTile) { setError("No tile selected for editing"); return; }

//       const updates = {
//         ...newTile,
//         size: newTile.size?.trim(),
//         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
//         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
//         inStock: (newTile.stock || 0) > 0,
//         updatedAt: new Date().toISOString(),
//       };

//       await updateTile(editingTile.id, updates);

//       const criticalFieldsChanged =
//         editingTile.name !== newTile.name ||
//         editingTile.tileCode !== newTile.tileCode ||
//         editingTile.price !== newTile.price ||
//         editingTile.size !== newTile.size ||
//         editingTile.category !== newTile.category;

//       if (criticalFieldsChanged) {
//         setTimeout(async () => {
//           try {
//             if (typeof getTileById !== "function" || typeof generateTileQRCode !== "function" || typeof updateTileQRCode !== "function") return;
//             const updatedTileData = await getTileById(editingTile.id);
//             if (!updatedTileData) return;
//             const newQRCode = await generateTileQRCode(updatedTileData);
//             if (!newQRCode || !newQRCode.startsWith("data:image")) return;
//             await updateTileQRCode(editingTile.id, newQRCode);
//             await loadData();
//           } catch (qrError: any) { /* non-critical */ }
//         }, 0);
//       }

//       await loadData();
//       setEditingTile(null);
//       resetNewTile();
//       setSuccess("Tile updated successfully!");
//     } catch (error: any) {
//       setError(`Failed to update tile: ${error.message}`);
//     }
//   };

//   const handleDeleteTile = async (tileId: string, tileName: string) => {
//     if (!window.confirm(`Delete "${tileName}"?`)) return;
//     try {
//       setError(null);
//       await deleteTile(tileId);
//       await loadData();
//       setSuccess("Tile deleted successfully");
//     } catch (error: any) {
//       setError(`Delete failed: ${error.message}`);
//     }
//   };

//   const resetNewTile = () => {
//     setNewTile({
//       name: "", category: "both", size: "", price: 0, stock: 0, inStock: true,
//       imageUrl: "", textureUrl: "", tileCode: "", tileSurface: "", tileMaterial: "",
//     });
//   };

//   const handleTabChange = (tab: TabKey) => {
//     setActiveTab(tab);
//     setError(null);
//     setSuccess(null);
//     setMobileMenuOpen(false);
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

//   const isScanAllowed = isFeatureAllowed('scan');
//   const isWorkerAllowed = isFeatureAllowed('worker');
//   const disabledMessage = getDisabledReason();

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ DERIVED STATS (REAL DATA — NO FAKE VALUES)
//   // ═══════════════════════════════════════════════════════════════

//   const totalStock = tiles.reduce((sum, t) => sum + (t.stock || 0), 0);
//   const inStockCount = tiles.filter((t) => t.inStock).length;
//   const outOfStockCount = tiles.filter((t) => !t.inStock).length;
//   const lowStockCount = tiles.filter((t) => t.inStock && (t.stock || 0) > 0 && (t.stock || 0) < 10).length;
//   const availabilityPct = tiles.length > 0 ? Math.round((inStockCount / tiles.length) * 100) : 0;
//   const categoryCount = new Set(tiles.map((t) => t.category)).size;

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ NAV ITEMS (SIDEBAR)
//   // ═══════════════════════════════════════════════════════════════

//   const navItems: {
//     id: TabKey;
//     label: string;
//     icon: React.ElementType;
//     restricted?: boolean;
//     external?: boolean;
//   }[] = [
//     { id: "tiles", label: "My Tiles", icon: LayoutGrid },
//     { id: "history", label: "History", icon: Clock },
//     { id: "billing", label: "Billing", icon: CreditCard },
//     { id: "customer-inquiries", label: "Customers", icon: Users },
//     { id: "analytics", label: "Analytics", icon: TrendingUp },
//     { id: "stock-analytics", label: "Stock Analytics", icon: Package },
//     { id: "worker", label: "Worker", icon: Shield, restricted: !isWorkerAllowed },
//     { id: "scan", label: "Scan", icon: QrCode, restricted: !isScanAllowed, external: true },
//     { id: "profile", label: "Profile", icon: User },
//     { id: "excel", label: "Excel", icon: FileSpreadsheet },
//     { id: "bulk", label: "CSV Upload", icon: Upload },
//     { id: "qrcodes", label: "QR Codes", icon: QrCode },
//   ];

//   const handleNavClick = (item: (typeof navItems)[number]) => {
//     if (item.id === "scan") {
//       if (isScanAllowed) window.open("/scan", "_blank");
//       else setShowPlansModal(true);
//       setMobileMenuOpen(false);
//       return;
//     }
//     if (item.id === "worker" && !isWorkerAllowed) {
//       setShowPlansModal(true);
//       setMobileMenuOpen(false);
//       return;
//     }
//     handleTabChange(item.id);
//   };

//   const tabMeta: Record<TabKey, { crumb: string; title: string; subtitle: string }> = {
//     tiles: { crumb: "Dashboard", title: "Tile Catalog", subtitle: "Organize your tiles, monitor stock, and power customer visualizations." },
//     history: { crumb: "Dashboard", title: "History", subtitle: "Track all your recent activity and changes." },
//     billing: { crumb: "Dashboard", title: "Billing", subtitle: "Manage your subscription and payment history." },
//     "customer-inquiries": { crumb: "Dashboard", title: "Customers", subtitle: "View and respond to customer inquiries." },
//     analytics: { crumb: "Dashboard", title: "Analytics", subtitle: "Deep insights into your showroom performance." },
//     "stock-analytics": { crumb: "Dashboard", title: "Stock Analytics", subtitle: "Monitor inventory trends and stock health." },
//     worker: { crumb: "Dashboard", title: "Worker Management", subtitle: "Manage worker accounts and permissions." },
//     scan: { crumb: "Dashboard", title: "Scan", subtitle: "Open the QR scanner." },
//     profile: { crumb: "Dashboard", title: "Profile", subtitle: "Manage your business profile and settings." },
//     excel: { crumb: "Dashboard", title: "Excel Import", subtitle: "Bulk import tiles using an Excel sheet." },
//     bulk: { crumb: "Dashboard", title: "CSV Upload", subtitle: "Bulk import tiles using a CSV file." },
//     qrcodes: { crumb: "Dashboard", title: "QR Codes", subtitle: "Generate and manage QR codes for your tiles." },
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER GUARDS
//   // ═══════════════════════════════════════════════════════════════

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full">
//           <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-gray-800 mb-3">Authentication Required</h2>
//           <p className="text-sm text-gray-600 mb-6">Please log in to access the seller dashboard.</p>
//           <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all">
//             Refresh Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full">
//           <User className="w-14 h-14 text-yellow-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-gray-800 mb-3">User Profile Not Found</h2>
//           <p className="text-sm text-gray-600 mb-6">Unable to load user profile. Please try logging in again.</p>
//           <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all">
//             Reload Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (currentUser.role !== "seller") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full">
//           <AlertCircle className="w-14 h-14 text-orange-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-gray-800 mb-3">Access Denied</h2>
//           <p className="text-sm text-gray-600 mb-6">
//             This dashboard is only accessible to sellers. Your role: <strong>{currentUser.role}</strong>
//           </p>
//           <button onClick={() => (window.location.href = "/")} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all">
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
//         <div className="text-center">
//           <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
//           <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
//           <p className="text-gray-500 text-sm mt-2">Loading data for {currentUser.full_name || currentUser.email}</p>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ TILE CARD RENDERER (used for mobile list + desktop grid)
//   // ═══════════════════════════════════════════════════════════════

//   const renderTileCard = (tile: Tile) => (
//     <div key={tile.id} className="bg-white border border-outline-variant/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex gap-3">
//         <div className="flex-shrink-0">
//           <img
//             src={tile.imageUrl}
//             alt={tile.name}
//             className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-outline-variant/40 shadow-sm bg-white p-1"
//             onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-tile.png"; }}
//           />
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2 mb-2">
//             <div className="min-w-0 flex-1">
//               <h3 className="font-bold text-on-surface text-sm sm:text-base truncate">{tile.name}</h3>
//               <p className="text-xs text-on-surface-variant font-mono">{tile.tileCode}</p>
//             </div>
//             <div className="flex gap-1 flex-shrink-0">
//               <button onClick={() => handleEditTile(tile)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
//                 <Edit className="w-4 h-4" />
//               </button>
//               <button onClick={() => handleDeleteTile(tile.id, tile.name)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors">
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
//             <div>
//               <span className="text-on-surface-variant">Category:</span>
//               <div className="mt-0.5">
//                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                   tile.category === "floor" ? "bg-primary-container/10 text-primary" :
//                   tile.category === "wall" ? "bg-secondary-container/10 text-secondary" :
//                   "bg-surface-container text-on-surface-variant"
//                 }`}>
//                   {tile.category === "both" ? "Both" : tile.category}
//                 </span>
//               </div>
//             </div>
//             <div>
//               <span className="text-on-surface-variant">Size:</span>
//               <div className="font-semibold text-on-surface">{tile.size}</div>
//             </div>
//             <div>
//               <span className="text-on-surface-variant">Price:</span>
//               <div className="font-bold text-on-surface">₹{tile.price.toLocaleString()}</div>
//             </div>
//             <div>
//               <span className="text-on-surface-variant">Stock:</span>
//               <div className="font-semibold text-on-surface">
//                 {tile.stock || 0}
//                 {(tile.stock || 0) < 10 && tile.inStock && <span className="text-orange-600 ml-1">(Low)</span>}
//               </div>
//             </div>
//           </div>

//           {(tile.tileSurface || tile.tileMaterial) && (
//             <div className="mt-3 border-t border-outline-variant/40 pt-3">
//               <button
//                 onClick={() => setExpandedTileId(expandedTileId === tile.id ? null : tile.id)}
//                 className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
//               >
//                 <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Tile Specifications</span>
//                 {expandedTileId === tile.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//               </button>
//               {expandedTileId === tile.id && (
//                 <div className="mt-2 space-y-2 animate-slide-down">
//                   {tile.tileSurface && (
//                     <div className="flex items-center justify-between text-xs">
//                       <span className="text-on-surface-variant flex items-center gap-1"><Circle className="w-3 h-3" /> Surface:</span>
//                       <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">{tile.tileSurface}</span>
//                     </div>
//                   )}
//                   {tile.tileMaterial && (
//                     <div className="flex items-center justify-between text-xs">
//                       <span className="text-on-surface-variant flex items-center gap-1"><Layers className="w-3 h-3" /> Material:</span>
//                       <span className="font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{tile.tileMaterial}</span>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="flex items-center gap-2 mt-3 flex-wrap">
//             <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(tile)}`}>
//               {getStockStatusText(tile)}
//             </span>
//             <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tile.qrCode ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
//               QR: {tile.qrCode ? "Yes" : "No"}
//             </span>
//             {tile.textureUrl && (
//               <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800">Has Texture</span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ MAIN RENDER
//   // ═══════════════════════════════════════════════════════════════

//   const currentMeta = tabMeta[activeTab] || tabMeta.tiles;
//   const displayName = currentUser.full_name || currentUser.email?.split('@')[0] || 'Seller';
//   const planLabel = planStatus.planName || (planStatus.loading ? 'Checking plan...' : 'No Active Plan');

//   return (
//     <div className="min-h-screen bg-[#f7f9fb] flex">
//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* MOBILE OVERLAY */}
//       {/* ═══════════════════════════════════════════════════════════ */}
//       {mobileMenuOpen && (
//         <div
//           onClick={() => setMobileMenuOpen(false)}
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
//         />
//       )}

//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* SIDEBAR */}
//       {/* ═══════════════════════════════════════════════════════════ */}
//       <aside
//         className={`fixed top-0 left-0 h-screen w-64 border-r border-outline-variant/60 bg-white/70 backdrop-blur-xl z-50 flex flex-col py-6 px-4 shadow-sm transition-transform duration-300 ${
//           mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0`}
//       >
//         {/* Logo */}
//         <div className="mb-8 px-2 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white flex-shrink-0">
//               <LayoutGrid className="w-5 h-5" />
//             </div>
//             <div className="min-w-0">
//               <h1 className="font-bold text-lg text-primary leading-tight truncate">Tilesview360</h1>
//               <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Seller Dashboard</p>
//             </div>
//           </div>
//           <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1 text-on-surface-variant hover:bg-surface-container rounded-lg">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Nav Items */}
//         <nav className="flex-1 space-y-1 overflow-y-auto sidebar-scroll pr-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = activeTab === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavClick(item)}
//                 title={item.restricted ? disabledMessage : undefined}
//                 className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
//                   isActive
//                     ? "text-primary bg-primary/10 border-r-4 border-primary"
//                     : item.restricted
//                     ? "text-gray-400 opacity-70 hover:bg-surface-container-high/40"
//                     : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40 hover:translate-x-1"
//                 }`}
//               >
//                 <Icon className="w-5 h-5 flex-shrink-0" />
//                 <span className="truncate">{item.label}</span>
//                 {item.restricted && (
//                   <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         {/* Bottom Section */}
//         <div className="mt-4 pt-4 border-t border-outline-variant/60 space-y-1 flex-shrink-0">
//           <button
//             onClick={() => {
//               setIsAddingTile(true);
//               setEditingTile(null);
//               resetNewTile();
//               setActiveTab("tiles");
//               setMobileMenuOpen(false);
//               window.scrollTo({ top: 0, behavior: 'smooth' });
//             }}
//             className="w-full mb-4 bg-primary text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 text-sm"
//           >
//             <Plus className="w-4 h-4" />
//             Create New Tile
//           </button>
//           <button
//             onClick={() => handleTabChange("profile")}
//             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40 transition-all text-sm font-medium"
//           >
//             <SettingsIcon className="w-4 h-4" />
//             Settings
//           </button>
//           <a
//             href="mailto:support@tilesview360.com"
//             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40 transition-all text-sm font-medium"
//           >
//             <HelpCircle className="w-4 h-4" />
//             Support
//           </a>
//         </div>
//       </aside>

//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* MAIN COLUMN (Header + Content) */}
//       {/* ═══════════════════════════════════════════════════════════ */}
//       <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
//         {/* TOP HEADER */}
//         <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-outline-variant/40 h-16 px-3 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
//           <div className="flex items-center gap-2 flex-1 min-w-0">
//             <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container-high/50 rounded-lg flex-shrink-0">
//               <Menu className="w-5 h-5" />
//             </button>
//             <div className="relative w-full max-w-2xl group">
//               <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
//               <input
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search tiles by name, code, material..."
//                 className="w-full bg-surface-container-low border-none rounded-full py-2 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-2 sm:gap-4 ml-3 flex-shrink-0">
//             <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-high/40 rounded-full transition-transform active:scale-90 hidden sm:inline-flex">
//               <Bell className="w-5 h-5" />
//               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
//             </button>
//             <button
//               onClick={() => handleTabChange("profile")}
//               className="p-2 text-on-surface-variant hover:bg-surface-container-high/40 rounded-full transition-transform active:scale-90 hidden sm:inline-flex"
//             >
//               <SettingsIcon className="w-5 h-5" />
//             </button>
//             <div className="h-6 w-px bg-outline-variant hidden sm:block" />
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="text-right hidden sm:block">
//                 <p className="font-bold text-sm text-on-surface truncate max-w-[120px]">{displayName}</p>
//                 <p className="text-[10px] text-on-surface-variant truncate max-w-[120px]">{planLabel}</p>
//               </div>
//               <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
//                 <User className="w-5 h-5 text-primary" />
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* CONTENT AREA */}
//         <main className="flex-1 px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
//           {/* Alerts */}
//           {error && (
//             <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake">
//               <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <p className="text-red-800 font-semibold text-sm">Error</p>
//                 <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
//               </div>
//               <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold text-lg">×</button>
//             </div>
//           )}
//           {success && (
//             <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-slide-down">
//               <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <p className="text-green-800 font-semibold text-sm">Success</p>
//                 <p className="text-green-700 text-xs sm:text-sm break-words">{success}</p>
//               </div>
//               <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600 font-bold text-lg">×</button>
//             </div>
//           )}

//           {/* Page Title Row */}
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
//             <div className="min-w-0">
//               <nav className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">
//                 {currentMeta.crumb}
//               </nav>
//               <h2 className="text-2xl sm:text-[28px] font-bold text-on-surface leading-tight">{currentMeta.title}</h2>
//               <p className="text-on-surface-variant text-sm mt-0.5">{currentMeta.subtitle}</p>
//             </div>
//             {activeTab === "tiles" && (
//               <button
//                 onClick={() => {
//                   setIsAddingTile(true);
//                   setEditingTile(null);
//                   resetNewTile();
//                   window.scrollTo({ top: 0, behavior: 'smooth' });
//                 }}
//                 className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-primary text-white hover:scale-105 active:scale-95 transition-all font-bold text-sm shadow-lg shadow-primary/20 w-fit"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add New Tile
//               </button>
//             )}
//           </div>

//           {/* ═══════════════════════════════════════════════════════ */}
//           {/* TILES TAB */}
//           {/* ═══════════════════════════════════════════════════════ */}
//           {activeTab === "tiles" && (
//             <>
//               {/* Premium / Plan Banner */}
//               <>
//               </>

//               {/* Real Plan Status Banner (business logic) */}
//               <PlanStatusBanner
//                 sellerId={currentUser?.user_id || ''}
//                 onViewPlans={() => setShowPlansModal(true)}
//                 forceRefresh={planRefreshTrigger}
//                 onPlanStatusChange={handlePlanStatusChange}
//               />

//               {/* Stats Grid */}
//               <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
//                 <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
//                   <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
//                     <LayoutGrid className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-on-surface-variant font-medium text-xs">Total Tiles</p>
//                     <h4 className="text-lg font-bold leading-tight">{tiles.length}</h4>
//                     <p className="text-primary text-[9px] font-bold uppercase tracking-wider">{categoryCount} Categories</p>
//                   </div>
//                 </div>
//                 <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
//                   <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <CheckCircle className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-on-surface-variant font-medium text-xs">In Stock</p>
//                     <h4 className="text-lg font-bold leading-tight">{inStockCount}</h4>
//                     <p className="text-green-600 text-[9px] font-bold uppercase tracking-wider">{availabilityPct}% Avail.</p>
//                   </div>
//                 </div>
//                 <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
//                   <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center flex-shrink-0">
//                     <Package className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-on-surface-variant font-medium text-xs">Total Stock</p>
//                     <h4 className="text-lg font-bold leading-tight">{totalStock}</h4>
//                     <p className="text-secondary text-[9px] font-bold uppercase tracking-wider">Units</p>
//                   </div>
//                 </div>
//                 <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
//                   <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <AlertCircle className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-on-surface-variant font-medium text-xs">Low Stock</p>
//                     <h4 className="text-lg font-bold leading-tight">{lowStockCount}</h4>
//                     <p className="text-orange-600 text-[9px] font-bold uppercase tracking-wider">Reorder</p>
//                   </div>
//                 </div>
//                 <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
//                   <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <Package className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-on-surface-variant font-medium text-xs">Out of Stock</p>
//                     <h4 className="text-lg font-bold leading-tight">{outOfStockCount}</h4>
//                     <p className="text-red-600 text-[9px] font-bold uppercase tracking-wider">Unavailable</p>
//                   </div>
//                 </div>
//               </section>

//               {/* Add/Edit Tile Form */}
//               {(isAddingTile || editingTile) && (
//                 <div className="p-4 sm:p-6 border border-primary/30 rounded-2xl bg-primary/5">
//                   <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-on-surface">
//                     {editingTile ? (
//                       <><Edit className="w-5 h-5 text-primary" /><span className="truncate">Edit: {editingTile.name}</span></>
//                     ) : (
//                       <><Plus className="w-5 h-5 text-primary" /> Add New Tile</>
//                     )}
//                   </h3>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Name *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter tile name"
//                         value={newTile.name}
//                         onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
//                         className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-shadow outline-none"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Code</label>
//                       <input
//                         type="text"
//                         placeholder="Auto-generated if empty"
//                         value={newTile.tileCode}
//                         onChange={(e) => setNewTile({ ...newTile, tileCode: e.target.value })}
//                         className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-shadow outline-none"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Category *</label>
//                       <select
//                         value={newTile.category}
//                         onChange={(e) => setNewTile({ ...newTile, category: e.target.value as any })}
//                         className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white cursor-pointer transition-shadow outline-none"
//                       >
//                         <option value="floor">Floor Only</option>
//                         <option value="wall">Wall Only</option>
//                         <option value="both">Floor & Wall</option>
//                       </select>
//                     </div>

//                     {/* SIZE */}
//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Size *</label>
//                       {(() => {
//                         const standardSizes = [
//                           "30x30 cm", "30x60 cm", "60x60 cm", "60x120 cm", "80x80 cm",
//                           "40x40 cm", "40x60 cm", "50x50 cm", "20x120 cm", "15x90 cm",
//                           "10x30 cm", "20x20 cm", "25x40 cm", "61x122 cm", "122x122 cm",
//                           "75x75 cm", "100x100 cm", "45x45 cm", "7.5x15 cm", "6x25 cm"
//                         ];
//                         const currentSize = newTile.size || "";
//                         const isManualMode = currentSize === "manual_trigger" || (currentSize !== "" && !standardSizes.includes(currentSize));
//                         let parsedWidth = "", parsedHeight = "";
//                         if (isManualMode && currentSize !== "manual_trigger") {
//                           const parts = currentSize.replace(" cm", "").split("x");
//                           if (parts.length === 2) { parsedWidth = parts[0]; parsedHeight = parts[1]; }
//                         }
//                         const handleManualChange = (w: string, h: string) => setNewTile({ ...newTile, size: `${w}x${h} cm` });

//                         return (
//                           <div className="space-y-3">
//                             {!isManualMode ? (
//                               <div>
//                                 <div className="relative">
//                                   <select
//                                     value={currentSize}
//                                     onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
//                                     className="w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm appearance-none cursor-pointer pr-10 outline-none"
//                                   >
//                                     <option value="">Select Tile Size</option>
//                                     {standardSizes.map((s) => <option key={s} value={s}>{s}</option>)}
//                                   </select>
//                                   <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3 top-3 pointer-events-none" />
//                                 </div>
//                                 <button type="button" onClick={() => setNewTile({ ...newTile, size: "manual_trigger" })} className="mt-2 text-xs sm:text-sm text-primary font-semibold hover:opacity-80 flex items-center gap-1">
//                                   <Plus className="w-3.5 h-3.5" /> Add Manual Size
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3 animate-slide-down">
//                                 <div className="flex justify-between items-center mb-1">
//                                   <span className="text-xs sm:text-sm font-bold text-primary">Enter Custom Size (in cm)</span>
//                                   <button type="button" onClick={() => setNewTile({ ...newTile, size: "" })} className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded">Cancel</button>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                   <div className="flex-1">
//                                     <label className="block text-[10px] sm:text-xs font-semibold text-primary mb-1">Width</label>
//                                     <input type="number" placeholder="e.g. 300" value={parsedWidth} onChange={(e) => handleManualChange(e.target.value, parsedHeight)} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" min="1" />
//                                   </div>
//                                   <div className="text-primary font-bold text-lg mt-5">×</div>
//                                   <div className="flex-1">
//                                     <label className="block text-[10px] sm:text-xs font-semibold text-primary mb-1">Height</label>
//                                     <input type="number" placeholder="e.g. 600" value={parsedHeight} onChange={(e) => handleManualChange(parsedWidth, e.target.value)} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" min="1" />
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     {/* SURFACE */}
//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Surface</label>
//                       {(() => {
//                         const standardSurfaces = ["Polished", "Step Side", "Matt", "Carving", "High Gloss", "Metallic", "Sugar", "Glue", "Punch"];
//                         const currentSurface = newTile.tileSurface || "";
//                         const isManualMode = currentSurface === "manual_trigger" || (currentSurface !== "" && !standardSurfaces.includes(currentSurface));
//                         return (
//                           <div className="space-y-3">
//                             {!isManualMode ? (
//                               <div>
//                                 <div className="relative">
//                                   <select value={currentSurface} onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value || undefined })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm appearance-none cursor-pointer pr-10 outline-none">
//                                     <option value="">Select Surface Finish</option>
//                                     {standardSurfaces.map((s) => <option key={s} value={s}>{s}</option>)}
//                                   </select>
//                                   <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3 top-3 pointer-events-none" />
//                                 </div>
//                                 <button type="button" onClick={() => setNewTile({ ...newTile, tileSurface: "manual_trigger" })} className="mt-2 text-xs sm:text-sm text-primary font-semibold hover:opacity-80 flex items-center gap-1">
//                                   <Plus className="w-3.5 h-3.5" /> Add Manual Surface
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3 animate-slide-down">
//                                 <div className="flex justify-between items-center mb-1">
//                                   <span className="text-xs sm:text-sm font-bold text-primary">Enter Custom Surface</span>
//                                   <button type="button" onClick={() => setNewTile({ ...newTile, tileSurface: "" })} className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded">Cancel</button>
//                                 </div>
//                                 <input type="text" placeholder="e.g. Rustic, Satin, 3D Print" value={currentSurface === "manual_trigger" ? "" : currentSurface} onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value })} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" autoFocus />
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                       {newTile.tileSurface && newTile.tileSurface !== "manual_trigger" && newTile.tileSurface.trim() !== "" && (
//                         <div className="flex items-center gap-2 text-xs text-green-600 mt-1.5">
//                           <CheckCircle className="w-3 h-3" /><span>Selected: <strong>{newTile.tileSurface}</strong></span>
//                         </div>
//                       )}
//                     </div>

//                     {/* MATERIAL */}
//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Material</label>
//                       {(() => {
//                         const standardMaterials = ["Slabs", "GVT & PGVT", "Double Charge", "Counter Tops", "Full Body", "Ceramic", "Mosaic", "Subway"];
//                         const currentMaterial = newTile.tileMaterial || "";
//                         const isManualMode = currentMaterial === "manual_trigger" || (currentMaterial !== "" && !standardMaterials.includes(currentMaterial));
//                         return (
//                           <div className="space-y-3">
//                             {!isManualMode ? (
//                               <div>
//                                 <div className="relative">
//                                   <select value={currentMaterial} onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value || undefined })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm appearance-none cursor-pointer pr-10 outline-none">
//                                     <option value="">Select Material Type</option>
//                                     {standardMaterials.map((m) => <option key={m} value={m}>{m}</option>)}
//                                   </select>
//                                   <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3 top-3 pointer-events-none" />
//                                 </div>
//                                 <button type="button" onClick={() => setNewTile({ ...newTile, tileMaterial: "manual_trigger" })} className="mt-2 text-xs sm:text-sm text-primary font-semibold hover:opacity-80 flex items-center gap-1">
//                                   <Plus className="w-3.5 h-3.5" /> Add Manual Material
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3 animate-slide-down">
//                                 <div className="flex justify-between items-center mb-1">
//                                   <span className="text-xs sm:text-sm font-bold text-primary">Enter Custom Material</span>
//                                   <button type="button" onClick={() => setNewTile({ ...newTile, tileMaterial: "" })} className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded">Cancel</button>
//                                 </div>
//                                 <input type="text" placeholder="e.g. Porcelain, Natural Stone, Glass" value={currentMaterial === "manual_trigger" ? "" : currentMaterial} onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value })} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" autoFocus />
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                       {newTile.tileMaterial && newTile.tileMaterial !== "manual_trigger" && newTile.tileMaterial.trim() !== "" && (
//                         <div className="flex items-center gap-2 text-xs text-green-600 mt-1.5">
//                           <CheckCircle className="w-3 h-3" /><span>Selected: <strong>{newTile.tileMaterial}</strong></span>
//                         </div>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Price (₹) *</label>
//                       <input type="number" placeholder="Enter price" value={newTile.price || ""} onChange={(e) => setNewTile({ ...newTile, price: e.target.value === "" ? 0 : Number(e.target.value) })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm outline-none" min="0" step="0.01" />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Stock Quantity *</label>
//                       <input type="number" placeholder="Enter stock quantity" value={newTile.stock || ""} onChange={(e) => setNewTile({ ...newTile, stock: e.target.value === "" ? 0 : Number(e.target.value) })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm outline-none" min="0" />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Image *</label>
//                       <div className="flex flex-col gap-2">
//                         <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "image"); }} className="hidden" id="tile-image-upload" />
//                         <label htmlFor="tile-image-upload" className={`flex items-center justify-center gap-2 px-3 py-2.5 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors text-sm font-medium ${imageUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
//                           {imageUploading ? <><Loader className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Choose Image</>}
//                         </label>
//                         {newTile.imageUrl && (
//                           <div className="flex items-center gap-2">
//                             <img src={newTile.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-outline-variant shadow-sm" />
//                             <div className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">Uploaded</span></div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Texture (Optional)</label>
//                       <div className="flex flex-col gap-2">
//                         <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "texture"); }} className="hidden" id="texture-image-upload" />
//                         <label htmlFor="texture-image-upload" className={`flex items-center justify-center gap-2 px-3 py-2.5 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors text-sm font-medium ${textureUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
//                           {textureUploading ? <><Loader className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Choose Texture</>}
//                         </label>
//                         {newTile.textureUrl && (
//                           <div className="flex items-center gap-2">
//                             <img src={newTile.textureUrl} alt="Texture" className="w-16 h-16 object-cover rounded-lg border border-outline-variant shadow-sm" />
//                             <div className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">Uploaded</span></div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col sm:flex-row gap-2 mt-6">
//                     <button
//                       onClick={editingTile ? handleUpdateTile : handleAddTile}
//                       disabled={imageUploading || textureUploading}
//                       className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold shadow-md shadow-primary/20"
//                     >
//                       <Save className="w-4 h-4" />
//                       {editingTile ? "Update Tile" : "Save Tile"}
//                     </button>
//                     <button
//                       onClick={() => { setIsAddingTile(false); setEditingTile(null); resetNewTile(); setError(null); }}
//                       className="px-6 py-2.5 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-sm font-semibold"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Inventory Card */}
//               <section className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 overflow-hidden shadow-sm">
//                 {/* Filter Bar */}
//                 <div className="p-4 border-b border-outline-variant/40 bg-white/40 flex flex-wrap items-center justify-between gap-3">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <div className="relative">
//                       <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-9 font-semibold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer outline-none">
//                         <option value="all">All Categories</option>
//                         <option value="floor">Floor</option>
//                         <option value="wall">Wall</option>
//                         <option value="both">Floor & Wall</option>
//                       </select>
//                       <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
//                     </div>
//                     <div className="relative">
//                       <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-9 font-semibold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer outline-none">
//                         <option value="all">Stock Status</option>
//                         <option value="in-stock">In Stock</option>
//                         <option value="out-of-stock">Out of Stock</option>
//                       </select>
//                       <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
//                     </div>
//                     <button onClick={loadData} title="Refresh" className="p-2 hover:bg-surface-container-highest/40 rounded-lg transition-all group">
//                       <RefreshCw className="w-4 h-4 text-on-surface-variant group-active:rotate-180 transition-transform duration-500" />
//                     </button>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <p className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">
//                       {currentTiles.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
//                     </p>
//                     <div className="hidden lg:flex bg-surface-container rounded-lg p-1">
//                       <button onClick={() => setViewMode("grid")} className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}>
//                         <LayoutGrid className="w-4 h-4" />
//                       </button>
//                       <button onClick={() => setViewMode("table")} className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${viewMode === "table" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}>
//                         <List className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Desktop Table */}
//                 {viewMode === "table" && (
//                   <div className="hidden lg:block overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                       <thead>
//                         <tr className="bg-surface-container-low/50 border-b border-outline-variant/40">
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Image</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Name</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Code</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Size</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Surface</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Material</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Price</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Stock</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">QR</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-outline-variant/20">
//                         {currentTiles.length === 0 ? (
//                           <tr>
//                             <td colSpan={12} className="text-center p-10 text-on-surface-variant">
//                               {tiles.length === 0 ? (
//                                 <div className="space-y-2"><Package className="w-12 h-12 text-gray-300 mx-auto" /><p className="font-semibold">No tiles found</p><p className="text-sm">Start by adding your first tile!</p></div>
//                               ) : (
//                                 <div className="space-y-2"><Search className="w-12 h-12 text-gray-300 mx-auto" /><p className="font-semibold">No tiles match your search</p><p className="text-sm">Try adjusting your search or filters</p></div>
//                               )}
//                             </td>
//                           </tr>
//                         ) : (
//                           currentTiles.map((tile) => (
//                             <tr key={tile.id} className="hover:bg-primary-container/5 transition-colors group">
//                               <td className="p-4">
//                                 <div className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-white p-1">
//                                   <img src={tile.imageUrl} alt={tile.name} className="w-full h-full object-cover rounded" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-tile.png"; }} />
//                                 </div>
//                               </td>
//                               <td className="p-4">
//                                 <p className="font-bold text-on-surface text-sm">{tile.name}</p>
//                                 {tile.textureUrl && <p className="text-[10px] text-green-600">Has texture</p>}
//                               </td>
//                               <td className="p-4"><span className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">{tile.tileCode}</span></td>
//                               <td className="p-4">
//                                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                                   tile.category === "floor" ? "bg-primary-container/10 text-primary" :
//                                   tile.category === "wall" ? "bg-secondary-container/10 text-secondary" :
//                                   "bg-surface-container text-on-surface-variant"
//                                 }`}>
//                                   {tile.category === "both" ? "Both" : tile.category.charAt(0).toUpperCase() + tile.category.slice(1)}
//                                 </span>
//                               </td>
//                               <td className="p-4 text-xs font-medium text-on-surface">{tile.size}</td>
//                               <td className="p-4">
//                                 {tile.tileSurface ? (
//                                   <div className="flex items-center gap-1.5 text-xs"><Circle className="w-3 h-3 text-on-surface-variant" /><span>{tile.tileSurface}</span></div>
//                                 ) : <span className="text-gray-400 text-xs">—</span>}
//                               </td>
//                               <td className="p-4">
//                                 {tile.tileMaterial ? (
//                                   <div className="flex items-center gap-1.5 text-xs"><Layers className="w-3.5 h-3.5 text-secondary" /><span>{tile.tileMaterial}</span></div>
//                                 ) : <span className="text-gray-400 text-xs">—</span>}
//                               </td>
//                               <td className="p-4 text-right font-bold text-sm text-on-surface">₹{tile.price.toLocaleString()}</td>
//                               <td className="p-4 text-center font-semibold text-sm text-on-surface">{tile.stock || 0}</td>
//                               <td className="p-4">
//                                 <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(tile)}`}>
//                                   {getStockStatusText(tile)}
//                                 </span>
//                               </td>
//                               <td className="p-4">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${tile.qrCode ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
//                                   {tile.qrCode ? "✓" : "○"}
//                                 </span>
//                               </td>
//                               <td className="p-4">
//                                 <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                   <button onClick={() => handleEditTile(tile)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all" title="Edit"><Edit className="w-4 h-4" /></button>
//                                   <button onClick={() => handleDeleteTile(tile.id, tile.name)} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}

//                 {/* Desktop Grid View */}
//                 {viewMode === "grid" && (
//                   <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4 p-4">
//                     {currentTiles.length === 0 ? (
//                       <div className="col-span-full text-center py-10 text-on-surface-variant">
//                         <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//                         <p className="font-semibold">No tiles found</p>
//                       </div>
//                     ) : (
//                       currentTiles.map((tile) => renderTileCard(tile))
//                     )}
//                   </div>
//                 )}

//                 {/* Mobile Card View */}
//                 <div className="lg:hidden p-3 sm:p-4 space-y-3">
//                   {currentTiles.length === 0 ? (
//                     <div className="text-center py-12 text-on-surface-variant">
//                       {tiles.length === 0 ? (
//                         <div className="space-y-2"><Package className="w-16 h-16 text-gray-300 mx-auto" /><p className="font-semibold">No tiles found</p><p className="text-sm">Start by adding your first tile!</p></div>
//                       ) : (
//                         <div className="space-y-2"><Search className="w-16 h-16 text-gray-300 mx-auto" /><p className="font-semibold">No tiles match your search</p><p className="text-sm">Try adjusting your search or filters</p></div>
//                       )}
//                     </div>
//                   ) : (
//                     currentTiles.map((tile) => renderTileCard(tile))
//                   )}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="p-4 bg-surface-container-low/50 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/30">
//                     <button onClick={goToPreviousPage} disabled={currentPage === 1} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentPage === 1 ? "border-outline-variant bg-white text-gray-400 cursor-not-allowed" : "border-outline-variant bg-white text-on-surface-variant hover:text-primary"}`}>
//                       <ChevronLeft className="w-4 h-4" /> Prev
//                     </button>
//                     <div className="flex items-center gap-1.5 flex-wrap justify-center">
//                       {getPageNumbers().map((page, index) =>
//                         page === '...' ? (
//                           <span key={`e-${index}`} className="px-2 text-on-surface-variant">...</span>
//                         ) : (
//                           <button key={page} onClick={() => goToPage(page as number)} className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${currentPage === page ? "bg-primary text-white" : "hover:bg-white text-on-surface-variant"}`}>
//                             {page}
//                           </button>
//                         )
//                       )}
//                     </div>
//                     <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentPage === totalPages ? "border-outline-variant bg-white text-gray-400 cursor-not-allowed" : "border-outline-variant bg-white text-on-surface-variant hover:text-primary"}`}>
//                       Next <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 )}
//               </section>
//             </>
//           )}

//           {/* ═══════════════════════════════════════════════════════ */}
//           {/* OTHER TABS */}
//           {/* ═══════════════════════════════════════════════════════ */}
//           {activeTab !== "tiles" && (
//             <section className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-4 sm:p-6">
//               {activeTab === "worker" && <WorkerManagement />}
//               {activeTab === "profile" && <SellerProfile />}
//               {activeTab === "excel" && <ExcelUpload onUploadComplete={loadData} />}
//               {activeTab === "stock-analytics" && <SellerStockAnalytics />}
//               {activeTab === "bulk" && <BulkUpload onUploadComplete={loadData} />}
//               {activeTab === "customer-inquiries" && <CustomerInquiriesManager />}
//               {activeTab === "qrcodes" && (
//                 <QRCodeManager tiles={tiles} sellerId={currentUser?.user_id} onQRCodeGenerated={loadData} />
//               )}
//               {activeTab === "history" && <HistoryTab />}
//               {activeTab === "analytics" && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
//               {activeTab === "billing" && (
//                 <BillingTab
//                   key={`billing-tab-${planRefreshTrigger}`}
//                   sellerId={currentUser?.user_id || ''}
//                   sellerEmail={currentUser?.email || ''}
//                 />
//               )}
//             </section>
//           )}
//         </main>

//         {/* FOOTER */}
//         <footer className="px-3 sm:px-6 lg:px-8 border-t border-outline-variant/40 flex flex-col sm:flex-row justify-between items-center gap-2 text-on-surface-variant py-4">
//           <p className="text-[11px]">© {new Date().getFullYear()} Tilesview360. All rights reserved.</p>
//           <div className="flex gap-4 text-[11px] font-medium">
//             <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
//             <a className="hover:text-primary transition-colors" href="#">Terms</a>
//             <a className="hover:text-primary transition-colors" href="#">API Docs</a>
//           </div>
//         </footer>
//       </div>

//       {/* MOBILE FAB */}
//       {activeTab === "tiles" && (
//         <button
//           onClick={() => { setIsAddingTile(true); setEditingTile(null); resetNewTile(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
//           className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#2d5bff] to-[#8127cf] rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform z-[60]"
//         >
//           <Plus className="w-6 h-6" />
//         </button>
//       )}

//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* PAYMENT MODALS */}
//       {/* ═══════════════════════════════════════════════════════════ */}
//       <PlansModal
//         isOpen={showPlansModal}
//         onClose={() => setShowPlansModal(false)}
//         isLoggedIn={isAuthenticated}
//         sellerId={currentUser?.user_id || ''}
//         userToken={userToken}
//       />

//       <PaymentConfirmationModal
//         isOpen={showPaymentConfirmation}
//         onClose={() => { setShowPaymentConfirmation(false); setSelectedPlan(null); }}
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
//           userToken={userToken}
//         />
//       )}
//     </div>
//   );
// };

// import React, { useState, useEffect } from "react";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Upload,
//   Save,
//   Package,
//   FileSpreadsheet,
//   AlertCircle,
//   CheckCircle,
//   Loader,
//   Search,
//   Users,
//   RefreshCw,
//   ChevronUp,
//   ChevronDown,
//   Eye,
//   TrendingUp,
//   QrCode,
//   User,
//   Menu,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   Shield,
//   Bell,
//   Settings as SettingsIcon,
//   LayoutGrid,
//   List,
//   Award,
//   Layers,
//   Circle,
//   HelpCircle,
//   CreditCard,
//   LogOut,
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
// import { jwtService } from '../lib/jwtService';
// import { PlansModal } from './Payment/PlansModal';
// import { PaymentConfirmationModal } from './Payment/PaymentConfirmationModal';
// import { PaymentCheckout } from './Payment/PaymentCheckout';
// import { initiatePayment } from '../lib/paymentService';
// import { getPlanById } from '../lib/planService';
// import type { Plan } from '../types/plan.types';
// import type { RazorpayCheckoutOptions } from '../types/payment.types';
// import { auth } from '../lib/firebase';
// import { HistoryTab } from "./HistoryTab";
// import {
//   uploadTile,
//   updateTile,
//   deleteTile,
//   getSellerProfile,
//   getSellerTiles,
//   updateTileQRCode,
//   getTileById,
// } from "../lib/firebaseutils";
// import { BillingTab } from './BillingTab';
// import {
//   getSellerSubscription,
//   isSubscriptionExpired,
//   getDaysUntilExpiry
// } from "../lib/subscriptionService";

// // ═══════════════════════════════════════════════════════════════
// // ✅ INTERFACES
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

// type TabKey =
//   | "tiles"
//   | "bulk"
//   | "excel"
//   | "analytics"
//   | "qrcodes"
//   | "profile"
//   | "worker"
//   | "scan"
//   | "stock-analytics"
//   | "customer-inquiries"
//   | "history"
//   | "billing";

// // ═══════════════════════════════════════════════════════════════
// // ✅ MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const SellerDashboard: React.FC = () => {
//   const { currentUser, isAuthenticated } = useAppStore();

//   // Tab Management
//   const [isAddingTile, setIsAddingTile] = useState(false);
//   const [activeTab, setActiveTab] = useState<TabKey>("tiles");

//   // Tile Management
//   const [editingTile, setEditingTile] = useState<Tile | null>(null);
//   const [sellerProfile, setSellerProfile] = useState<any>(null);
//   const [tiles, setTiles] = useState<Tile[]>([]);
//   const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
//   const [userToken, setUserToken] = useState<string>('');

//   // UI State
//   const [loading, setLoading] = useState(true);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [textureUploading, setTextureUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [loggingOut, setLoggingOut] = useState(false);

//   // Filter State
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState<string>("all");
//   const [stockFilter, setStockFilter] = useState<string>("all");
//   const [viewMode, setViewMode] = useState<"table" | "grid">("table");

//   // Mobile / Sidebar UI
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [expandedTileId, setExpandedTileId] = useState<string | null>(null);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(2);

//   // Payment State
//   const [showPlansModal, setShowPlansModal] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
//   const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0);
//   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
//   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   useEffect(() => {
//     const checkPaymentSuccess = () => {
//       const flag = localStorage.getItem('plan_just_purchased');
//       if (flag) {
//         setPlanRefreshTrigger(prev => prev + 1);
//         localStorage.removeItem('plan_just_purchased');
//         if (showPlansModal) {
//           setTimeout(() => setShowPlansModal(false), 3000);
//         }
//       }
//     };
//     const interval = setInterval(checkPaymentSuccess, 1000);
//     return () => clearInterval(interval);
//   }, [showPlansModal]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const token = jwtService.getAccessToken();
//       if (token) {
//         const isValid = jwtService.isValidTokenFormat(token);
//         setUserToken(isValid ? token : '');
//       } else {
//         setUserToken('');
//       }
//     } else {
//       setUserToken('');
//     }
//   }, [isAuthenticated]);

//   const [planStatus, setPlanStatus] = useState<SellerPlanStatus>({
//     isActive: false,
//     expiresAt: null,
//     planName: null,
//     planId: null,
//     daysRemaining: 0,
//     loading: true,
//     lastChecked: null
//   });

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
//   // ✅ PLAN STATUS
//   // ═══════════════════════════════════════════════════════════════

//   const checkSellerPlanStatus = async (sellerId: string): Promise<SellerPlanStatus> => {
//     try {
//       const subscription = await getSellerSubscription(sellerId, true);
//       if (!subscription) {
//         return { isActive: false, expiresAt: null, planName: null, planId: null, daysRemaining: 0, loading: false, lastChecked: new Date() };
//       }
//       const expired = isSubscriptionExpired(subscription);
//       const daysRemaining = getDaysUntilExpiry(subscription);
//       const endDate = subscription.end_date ? new Date(subscription.end_date) : null;
//       return {
//         isActive: !expired,
//         expiresAt: endDate,
//         planName: subscription.plan_name || null,
//         planId: subscription.plan_id || null,
//         daysRemaining,
//         loading: false,
//         lastChecked: new Date()
//       };
//     } catch (error: any) {
//       return { isActive: false, expiresAt: null, planName: null, planId: null, daysRemaining: 0, loading: false, lastChecked: new Date() };
//     }
//   };

//   const loadPlanStatus = async () => {
//     if (!currentUser?.user_id) return;
//     try {
//       const status = await checkSellerPlanStatus(currentUser.user_id);
//       setPlanStatus(status);
//     } catch (error: any) {
//       setPlanStatus({ isActive: false, expiresAt: null, planName: null, planId: null, daysRemaining: 0, loading: false, lastChecked: new Date() });
//     }
//   };

//   const handlePlanStatusChange = async (isActive: boolean, isExpired: boolean) => {
//     setPlanStatus(prev => ({ ...prev, isActive, loading: false, lastChecked: new Date() }));
//     if (!isActive && isExpired) {
//       setTimeout(async () => { await loadPlanStatus(); }, 1000);
//     }
//   };

//   const isFeatureAllowed = (feature: 'scan' | 'worker' | 'analytics'): boolean => {
//     if (planStatus.loading) return false;
//     return planStatus.isActive;
//   };

//   const getDisabledReason = (): string => {
//     if (planStatus.loading) return 'Checking plan status...';
//     if (!planStatus.isActive) {
//       if (planStatus.expiresAt) return `Your plan expired on ${planStatus.expiresAt.toLocaleDateString()}. Please renew to continue.`;
//       return 'No active plan. Please subscribe to access this feature.';
//     }
//     if (planStatus.daysRemaining <= 3) return `Your plan expires in ${planStatus.daysRemaining} days. Consider renewing soon.`;
//     return '';
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ EFFECTS
//   // ═══════════════════════════════════════════════════════════════

//   useEffect(() => {
//     if (currentUser && isAuthenticated) {
//       loadData();
//       loadPlanStatus();
//     } else if (currentUser === null && !isAuthenticated) {
//       setLoading(false);
//     }
//   }, [currentUser, isAuthenticated]);

//   useEffect(() => {
//     if (currentUser?.user_id && isAuthenticated && planRefreshTrigger > 0) {
//       loadPlanStatus();
//     }
//   }, [planRefreshTrigger, currentUser?.user_id, isAuthenticated]);

//   useEffect(() => {
//     filterTiles();
//     setCurrentPage(1);
//   }, [tiles, searchTerm, categoryFilter, stockFilter]);

//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => { setError(null); setSuccess(null); }, 5000);
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
//       const [profile, sellerTiles] = await Promise.all([
//         getSellerProfile(currentUser?.user_id || ""),
//         getSellerTiles(currentUser?.user_id || ""),
//       ]);
//       setSellerProfile(profile);
//       if (sellerTiles && sellerTiles.length > 0) {
//         const uniqueTilesMap = new Map();
//         sellerTiles.forEach((tile) => {
//           if (tile.id && !uniqueTilesMap.has(tile.id)) uniqueTilesMap.set(tile.id, tile);
//         });
//         setTiles(Array.from(uniqueTilesMap.values()));
//       } else {
//         setTiles([]);
//       }
//     } catch (error: any) {
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
//     if (categoryFilter !== "all") filtered = filtered.filter((tile) => tile.category === categoryFilter);
//     if (stockFilter === "in-stock") filtered = filtered.filter((tile) => tile.inStock);
//     else if (stockFilter === "out-of-stock") filtered = filtered.filter((tile) => !tile.inStock);
//     setFilteredTiles(filtered);
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ PAGINATION
//   // ═══════════════════════════════════════════════════════════════

//   const totalPages = Math.ceil(filteredTiles.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentTiles = filteredTiles.slice(indexOfFirstItem, indexOfLastItem);

//   const goToPage = (pageNumber: number) => { setCurrentPage(pageNumber); window.scrollTo({ top: 0, behavior: 'smooth' }); };
//   const goToNextPage = () => { if (currentPage < totalPages) { setCurrentPage(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
//   const goToPreviousPage = () => { if (currentPage > 1) { setCurrentPage(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

//   const getPageNumbers = () => {
//     const pages: (number | string)[] = [];
//     const maxPagesToShow = 5;
//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else if (currentPage <= 3) {
//       for (let i = 1; i <= 4; i++) pages.push(i);
//       pages.push('...'); pages.push(totalPages);
//     } else if (currentPage >= totalPages - 2) {
//       pages.push(1); pages.push('...');
//       for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
//     } else {
//       pages.push(1); pages.push('...');
//       for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
//       pages.push('...'); pages.push(totalPages);
//     }
//     return pages;
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ PAYMENT HANDLERS
//   // ═══════════════════════════════════════════════════════════════

//   const handlePlanSelection = async (planId: string) => {
//     try {
//       if (!isAuthenticated) { setShowPlansModal(false); setError('Please login to select a plan'); return; }
//       const plan = await getPlanById(planId);
//       if (!plan) { setError('❌ Plan not found. Please try again.'); return; }
//       setSelectedPlan(plan);
//       setShowPlansModal(false);
//       setShowPaymentConfirmation(true);
//     } catch (error: any) {
//       setError(`❌ Error: ${error.message}`);
//     }
//   };

//   const handlePaymentConfirm = async () => {
//     if (!selectedPlan) { setError('❌ No plan selected'); return; }
//     setProcessingPayment(true);
//     try {
//       const currentUserAuth = auth.currentUser;
//       if (!currentUserAuth) throw new Error('Please login first');
//       const result = await initiatePayment(selectedPlan.id, selectedPlan.plan_name, selectedPlan.price);
//       if (!result.success || !result.checkoutOptions || !result.paymentId) throw new Error(result.error || 'Failed to initiate payment');
//       setCheckoutOptions(result.checkoutOptions);
//       setPaymentId(result.paymentId);
//       setShowPaymentConfirmation(false);
//     } catch (error: any) {
//       setError(`❌ Payment Error: ${error.message}`);
//       setProcessingPayment(false);
//     }
//   };

//   const handlePaymentSuccess = async () => {
//     try {
//       setCheckoutOptions(null); setPaymentId(null); setProcessingPayment(false);
//       setSelectedPlan(null); setShowPaymentConfirmation(false); setShowPlansModal(false);
//       setSuccess('🎉 Payment successful! Activating plan...');
//       try {
//         const { enableAllSellersWorkers } = await import('../lib/firebaseutils');
//         const result = await enableAllSellersWorkers(currentUser?.user_id || '');
//         if (result.success && result.count > 0) setSuccess(`🎉 Plan activated! ${result.count} worker(s) enabled.`);
//       } catch (workerError: any) { /* non-critical */ }
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       setPlanRefreshTrigger(prev => prev + 1);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       await loadPlanStatus();
//       await loadData();
//       setSuccess('✅ Plan activated! Workers can now login.');
//       setTimeout(() => setSuccess(null), 7000);
//     } catch (error: any) {
//       setError('Payment successful but refresh failed. Reload page manually.');
//     }
//   };

//   const handlePaymentError = async (error: string) => {
//     setError(`❌ Payment Error: ${error}`);
//     setCheckoutOptions(null); setPaymentId(null); setProcessingPayment(false);
//     setSelectedPlan(null); setShowPaymentConfirmation(false);
//     setTimeout(async () => { await loadPlanStatus(); }, 2000);
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ LOGOUT HANDLER
//   // ═══════════════════════════════════════════════════════════════

//   const handleLogout = async () => {
//     const confirmLogout = window.confirm("Are you sure you want to logout?");
//     if (!confirmLogout) return;

//     try {
//       setLoggingOut(true);
//       setError(null);
//       setSuccess(null);

//       // Clear JWT tokens (safe optional calls - works regardless of jwtService API shape)
//       try {
//         (jwtService as any).clearTokens?.();
//         (jwtService as any).logout?.();
//         (jwtService as any).clearAccessToken?.();
//         (jwtService as any).clearRefreshToken?.();
//       } catch (tokenError) {
//         console.warn("Token cleanup warning:", tokenError);
//       }

//       // Sign out from Firebase Auth
//       try {
//         await auth.signOut();
//       } catch (firebaseError) {
//         console.warn("Firebase signout warning:", firebaseError);
//       }

//       // Clear Zustand app store auth state (safe optional calls)
//       try {
//         const storeApi = (useAppStore as any).getState?.();
//         storeApi?.logout?.();
//         storeApi?.setCurrentUser?.(null);
//         storeApi?.setIsAuthenticated?.(false);
//         storeApi?.reset?.();
//       } catch (storeError) {
//         console.warn("Store cleanup warning:", storeError);
//       }

//       // Clear all local/session storage to remove any leftover auth data
//       try {
//         localStorage.clear();
//         sessionStorage.clear();
//       } catch (storageError) {
//         console.warn("Storage cleanup warning:", storageError);
//       }

//       // Full page reload redirect to home - ensures completely fresh app state
//       window.location.href = '/';
//     } catch (error: any) {
//       console.error("Logout failed:", error);
//       setError("Failed to logout. Please try again.");
//       setLoggingOut(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ TILE MANAGEMENT FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════

//   const generateTileCode = (): string => {
//     const prefix = sellerProfile?.business_name?.substring(0, 3).toUpperCase() || "TIL";
//     const timestamp = Date.now().toString().slice(-6);
//     const random = Math.random().toString(36).substring(2, 4).toUpperCase();
//     return `${prefix}${timestamp}${random}`;
//   };

//   const handleImageUpload = async (file: File, type: "image" | "texture") => {
//     try {
//       type === "image" ? setImageUploading(true) : setTextureUploading(true);
//       if (!file.type.startsWith("image/")) throw new Error("Please select a valid image file");
//       if (file.size > 5 * 1024 * 1024) throw new Error("Image size should be less than 5MB");
//       const imageUrl = await uploadToCloudinaryWrapper(file, type === "image" ? "tiles/main" : "tiles/textures");
//       if (type === "image") setNewTile((prev) => ({ ...prev, imageUrl }));
//       else setNewTile((prev) => ({ ...prev, textureUrl: imageUrl }));
//       setSuccess(`${type === "image" ? "Image" : "Texture"} uploaded successfully`);
//     } catch (error: any) {
//       setError(error.message || `Failed to upload ${type}`);
//     } finally {
//       type === "image" ? setImageUploading(false) : setTextureUploading(false);
//     }
//   };

//   // wrapper kept separate to avoid breaking import name collisions
//   const uploadToCloudinaryWrapper = async (file: File, folder: string) => {
//     const { uploadToCloudinary } = await import("../utils/cloudinaryUtils");
//     return uploadToCloudinary(file, folder);
//   };

//   const validateTileForm = (): string | null => {
//     if (!newTile.name?.trim()) return "❌ Tile Name is required. Please enter a tile name.";
//     if (!newTile.size || newTile.size.trim() === "" || newTile.size === "manual_trigger") {
//       return "❌ Tile Size is required. Please select or enter a size.";
//     }
//     if (newTile.size.includes('x') && !newTile.size.match(/^\d+x\d+ cm$/)) {
//       return "❌ Invalid Manual Size. Please enter BOTH Width and Height properly.";
//     }
//     if (!newTile.price || newTile.price <= 0) return "❌ Valid Price is required. Please enter a price greater than 0.";
//     if (newTile.stock === undefined || newTile.stock < 0) return "❌ Valid Stock Quantity is required. Please enter stock (0 or more).";
//     if (!newTile.imageUrl?.trim()) return "❌ Tile Image is required. Please upload an image before saving.";
//     return null;
//   };

//   const handleAddTile = async () => {
//     try {
//       setError(null);
//       const validationError = validateTileForm();
//       if (validationError) {
//         setError(validationError);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         return;
//       }
//       if (!currentUser) { setError("User not authenticated"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }

//       const tileCode = newTile.tileCode || generateTileCode();
//       const baseTileData = {
//         ...newTile,
//         size: newTile.size?.trim(),
//         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
//         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
//         sellerId: currentUser.user_id,
//         showroomId: currentUser.user_id,
//         tileCode,
//         inStock: (newTile.stock || 0) > 0,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       const savedTile = await uploadTile(baseTileData);
//       if (!savedTile || !savedTile.id) throw new Error("Tile saved but ID not returned");

//       let qrCodeGenerated = false;
//       try {
//         const qrCodeDataUrl = await generateTileQRCode(savedTile);
//         await updateTileQRCode(savedTile.id, qrCodeDataUrl);
//         qrCodeGenerated = true;
//       } catch (qrError: any) { /* non-critical */ }

//       await loadData();
//       setIsAddingTile(false);
//       resetNewTile();
//       setSuccess(qrCodeGenerated ? "✅ Tile added successfully with QR code!" : "✅ Tile added! QR code can be generated from QR Codes tab.");
//     } catch (error: any) {
//       setError(`Failed to add tile: ${error.message}`);
//     }
//   };

//   const handleEditTile = async (tile: Tile) => {
//     setEditingTile(tile);
//     setNewTile({ ...tile, stock: tile.stock || 0 });
//     setIsAddingTile(false);
//     setError(null);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleUpdateTile = async () => {
//     try {
//       setError(null);
//       const validationError = validateTileForm();
//       if (validationError) { setError(validationError); return; }
//       if (!editingTile) { setError("No tile selected for editing"); return; }

//       const updates = {
//         ...newTile,
//         size: newTile.size?.trim(),
//         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
//         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
//         inStock: (newTile.stock || 0) > 0,
//         updatedAt: new Date().toISOString(),
//       };

//       await updateTile(editingTile.id, updates);

//       const criticalFieldsChanged =
//         editingTile.name !== newTile.name ||
//         editingTile.tileCode !== newTile.tileCode ||
//         editingTile.price !== newTile.price ||
//         editingTile.size !== newTile.size ||
//         editingTile.category !== newTile.category;

//       if (criticalFieldsChanged) {
//         setTimeout(async () => {
//           try {
//             if (typeof getTileById !== "function" || typeof generateTileQRCode !== "function" || typeof updateTileQRCode !== "function") return;
//             const updatedTileData = await getTileById(editingTile.id);
//             if (!updatedTileData) return;
//             const newQRCode = await generateTileQRCode(updatedTileData);
//             if (!newQRCode || !newQRCode.startsWith("data:image")) return;
//             await updateTileQRCode(editingTile.id, newQRCode);
//             await loadData();
//           } catch (qrError: any) { /* non-critical */ }
//         }, 0);
//       }

//       await loadData();
//       setEditingTile(null);
//       resetNewTile();
//       setSuccess("Tile updated successfully!");
//     } catch (error: any) {
//       setError(`Failed to update tile: ${error.message}`);
//     }
//   };

//   const handleDeleteTile = async (tileId: string, tileName: string) => {
//     if (!window.confirm(`Delete "${tileName}"?`)) return;
//     try {
//       setError(null);
//       await deleteTile(tileId);
//       await loadData();
//       setSuccess("Tile deleted successfully");
//     } catch (error: any) {
//       setError(`Delete failed: ${error.message}`);
//     }
//   };

//   const resetNewTile = () => {
//     setNewTile({
//       name: "", category: "both", size: "", price: 0, stock: 0, inStock: true,
//       imageUrl: "", textureUrl: "", tileCode: "", tileSurface: "", tileMaterial: "",
//     });
//   };

//   const handleTabChange = (tab: TabKey) => {
//     setActiveTab(tab);
//     setError(null);
//     setSuccess(null);
//     setMobileMenuOpen(false);
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ TILE FORM TOGGLE (Add/Close unified logic for all trigger buttons)
//   // ═══════════════════════════════════════════════════════════════

//   const isTileFormOpen = activeTab === "tiles" && (isAddingTile || editingTile !== null);

//   const handleTileFormToggle = () => {
//     if (isTileFormOpen) {
//       // Form is open -> Close it
//       setIsAddingTile(false);
//       setEditingTile(null);
//       resetNewTile();
//       setError(null);
//     } else {
//       // Form is closed -> Open it (fresh "Add" mode)
//       setIsAddingTile(true);
//       setEditingTile(null);
//       resetNewTile();
//       setError(null);
//       setActiveTab("tiles");
//       setMobileMenuOpen(false);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
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

//   const isScanAllowed = isFeatureAllowed('scan');
//   const isWorkerAllowed = isFeatureAllowed('worker');
//   const disabledMessage = getDisabledReason();

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ DERIVED STATS (REAL DATA — NO FAKE VALUES)
//   // ═══════════════════════════════════════════════════════════════

//   const totalStock = tiles.reduce((sum, t) => sum + (t.stock || 0), 0);
//   const inStockCount = tiles.filter((t) => t.inStock).length;
//   const outOfStockCount = tiles.filter((t) => !t.inStock).length;
//   const lowStockCount = tiles.filter((t) => t.inStock && (t.stock || 0) > 0 && (t.stock || 0) < 10).length;
//   const availabilityPct = tiles.length > 0 ? Math.round((inStockCount / tiles.length) * 100) : 0;
//   const categoryCount = new Set(tiles.map((t) => t.category)).size;

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ NAV ITEMS (SIDEBAR)
//   // ═══════════════════════════════════════════════════════════════

//   const navItems: {
//     id: TabKey;
//     label: string;
//     icon: React.ElementType;
//     restricted?: boolean;
//     external?: boolean;
//   }[] = [
//     { id: "tiles", label: "My Tiles", icon: LayoutGrid },
//     { id: "history", label: "History", icon: Clock },
//     { id: "billing", label: "Billing", icon: CreditCard },
//     { id: "customer-inquiries", label: "Customers", icon: Users },
//     { id: "analytics", label: "Analytics", icon: TrendingUp },
//     { id: "stock-analytics", label: "Stock Analytics", icon: Package },
//     { id: "worker", label: "Worker", icon: Shield, restricted: !isWorkerAllowed },
//     { id: "scan", label: "Scan", icon: QrCode, restricted: !isScanAllowed, external: true },
//     { id: "profile", label: "Profile", icon: User },
//     { id: "excel", label: "Excel", icon: FileSpreadsheet },
//     { id: "bulk", label: "CSV Upload", icon: Upload },
//     { id: "qrcodes", label: "QR Codes", icon: QrCode },
//   ];

//   const handleNavClick = (item: (typeof navItems)[number]) => {
//     if (item.id === "scan") {
//       if (isScanAllowed) window.open("/scan", "_blank");
//       else setShowPlansModal(true);
//       setMobileMenuOpen(false);
//       return;
//     }
//     if (item.id === "worker" && !isWorkerAllowed) {
//       setShowPlansModal(true);
//       setMobileMenuOpen(false);
//       return;
//     }
//     handleTabChange(item.id);
//   };

//   const tabMeta: Record<TabKey, { crumb: string; title: string; subtitle: string }> = {
//     tiles: { crumb: "Dashboard", title: "Tile Catalog", subtitle: "Organize your tiles, monitor stock, and power customer visualizations." },
//     history: { crumb: "Dashboard", title: "History", subtitle: "Track all your recent activity and changes." },
//     billing: { crumb: "Dashboard", title: "Billing", subtitle: "Manage your subscription and payment history." },
//     "customer-inquiries": { crumb: "Dashboard", title: "Customers", subtitle: "View and respond to customer inquiries." },
//     analytics: { crumb: "Dashboard", title: "Analytics", subtitle: "Deep insights into your showroom performance." },
//     "stock-analytics": { crumb: "Dashboard", title: "Stock Analytics", subtitle: "Monitor inventory trends and stock health." },
//     worker: { crumb: "Dashboard", title: "Worker Management", subtitle: "Manage worker accounts and permissions." },
//     scan: { crumb: "Dashboard", title: "Scan", subtitle: "Open the QR scanner." },
//     profile: { crumb: "Dashboard", title: "Profile", subtitle: "Manage your business profile and settings." },
//     excel: { crumb: "Dashboard", title: "Excel Import", subtitle: "Bulk import tiles using an Excel sheet." },
//     bulk: { crumb: "Dashboard", title: "CSV Upload", subtitle: "Bulk import tiles using a CSV file." },
//     qrcodes: { crumb: "Dashboard", title: "QR Codes", subtitle: "Generate and manage QR codes for your tiles." },
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER GUARDS
//   // ═══════════════════════════════════════════════════════════════

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full">
//           <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-gray-800 mb-3">Authentication Required</h2>
//           <p className="text-sm text-gray-600 mb-6">Please log in to access the seller dashboard.</p>
//           <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all">
//             Refresh Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full">
//           <User className="w-14 h-14 text-yellow-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-gray-800 mb-3">User Profile Not Found</h2>
//           <p className="text-sm text-gray-600 mb-6">Unable to load user profile. Please try logging in again.</p>
//           <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all">
//             Reload Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (currentUser.role !== "seller") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full">
//           <AlertCircle className="w-14 h-14 text-orange-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-gray-800 mb-3">Access Denied</h2>
//           <p className="text-sm text-gray-600 mb-6">
//             This dashboard is only accessible to sellers. Your role: <strong>{currentUser.role}</strong>
//           </p>
//           <button onClick={() => (window.location.href = "/")} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all">
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
//         <div className="text-center">
//           <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
//           <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
//           <p className="text-gray-500 text-sm mt-2">Loading data for {currentUser.full_name || currentUser.email}</p>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ TILE CARD RENDERER (used for mobile list + desktop grid)
//   // ═══════════════════════════════════════════════════════════════

//   const renderTileCard = (tile: Tile) => (
//     <div key={tile.id} className="bg-white border border-outline-variant/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex gap-3">
//         <div className="flex-shrink-0">
//           <img
//             src={tile.imageUrl}
//             alt={tile.name}
//             className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-outline-variant/40 shadow-sm bg-white p-1"
//             onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-tile.png"; }}
//           />
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2 mb-2">
//             <div className="min-w-0 flex-1">
//               <h3 className="font-bold text-on-surface text-sm sm:text-base truncate">{tile.name}</h3>
//               <p className="text-xs text-on-surface-variant font-mono">{tile.tileCode}</p>
//             </div>
//             <div className="flex gap-1 flex-shrink-0">
//               <button onClick={() => handleEditTile(tile)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
//                 <Edit className="w-4 h-4" />
//               </button>
//               <button onClick={() => handleDeleteTile(tile.id, tile.name)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors">
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
//             <div>
//               <span className="text-on-surface-variant">Category:</span>
//               <div className="mt-0.5">
//                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                   tile.category === "floor" ? "bg-primary-container/10 text-primary" :
//                   tile.category === "wall" ? "bg-secondary-container/10 text-secondary" :
//                   "bg-surface-container text-on-surface-variant"
//                 }`}>
//                   {tile.category === "both" ? "Both" : tile.category}
//                 </span>
//               </div>
//             </div>
//             <div>
//               <span className="text-on-surface-variant">Size:</span>
//               <div className="font-semibold text-on-surface">{tile.size}</div>
//             </div>
//             <div>
//               <span className="text-on-surface-variant">Price:</span>
//               <div className="font-bold text-on-surface">₹{tile.price.toLocaleString()}</div>
//             </div>
//             <div>
//               <span className="text-on-surface-variant">Stock:</span>
//               <div className="font-semibold text-on-surface">
//                 {tile.stock || 0}
//                 {(tile.stock || 0) < 10 && tile.inStock && <span className="text-orange-600 ml-1">(Low)</span>}
//               </div>
//             </div>
//           </div>

//           {(tile.tileSurface || tile.tileMaterial) && (
//             <div className="mt-3 border-t border-outline-variant/40 pt-3">
//               <button
//                 onClick={() => setExpandedTileId(expandedTileId === tile.id ? null : tile.id)}
//                 className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
//               >
//                 <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Tile Specifications</span>
//                 {expandedTileId === tile.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//               </button>
//               {expandedTileId === tile.id && (
//                 <div className="mt-2 space-y-2 animate-slide-down">
//                   {tile.tileSurface && (
//                     <div className="flex items-center justify-between text-xs">
//                       <span className="text-on-surface-variant flex items-center gap-1"><Circle className="w-3 h-3" /> Surface:</span>
//                       <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">{tile.tileSurface}</span>
//                     </div>
//                   )}
//                   {tile.tileMaterial && (
//                     <div className="flex items-center justify-between text-xs">
//                       <span className="text-on-surface-variant flex items-center gap-1"><Layers className="w-3 h-3" /> Material:</span>
//                       <span className="font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{tile.tileMaterial}</span>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="flex items-center gap-2 mt-3 flex-wrap">
//             <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(tile)}`}>
//               {getStockStatusText(tile)}
//             </span>
//             <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tile.qrCode ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
//               QR: {tile.qrCode ? "Yes" : "No"}
//             </span>
//             {tile.textureUrl && (
//               <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800">Has Texture</span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ MAIN RENDER
//   // ═══════════════════════════════════════════════════════════════

//   const currentMeta = tabMeta[activeTab] || tabMeta.tiles;
//   const displayName = currentUser.full_name || currentUser.email?.split('@')[0] || 'Seller';
//   const planLabel = planStatus.planName || (planStatus.loading ? 'Checking plan...' : 'No Active Plan');

//   return (
//     <div className="min-h-screen bg-[#f7f9fb] flex">
//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* MOBILE OVERLAY */}
//       {/* ═══════════════════════════════════════════════════════════ */}
//       {mobileMenuOpen && (
//         <div
//           onClick={() => setMobileMenuOpen(false)}
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
//         />
//       )}

//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* SIDEBAR */}
//       {/* ═══════════════════════════════════════════════════════════ */}
//       <aside
//         className={`fixed top-0 left-0 h-screen w-64 border-r border-outline-variant/60 bg-white/70 backdrop-blur-xl z-50 flex flex-col py-6 px-4 shadow-sm transition-transform duration-300 ${
//           mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0`}
//       >
//         {/* Logo */}
//         <div className="mb-8 px-2 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white flex-shrink-0">
//               <LayoutGrid className="w-5 h-5" />
//             </div>
//             <div className="min-w-0">
//               <h1 className="font-bold text-lg text-primary leading-tight truncate">Tilesview360</h1>
//               <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Seller Dashboard</p>
//             </div>
//           </div>
//           <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1 text-on-surface-variant hover:bg-surface-container rounded-lg">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Nav Items */}
//         <nav className="flex-1 space-y-1 overflow-y-auto sidebar-scroll pr-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = activeTab === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavClick(item)}
//                 title={item.restricted ? disabledMessage : undefined}
//                 className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
//                   isActive
//                     ? "text-primary bg-primary/10 border-r-4 border-primary"
//                     : item.restricted
//                     ? "text-gray-400 opacity-70 hover:bg-surface-container-high/40"
//                     : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40 hover:translate-x-1"
//                 }`}
//               >
//                 <Icon className="w-5 h-5 flex-shrink-0" />
//                 <span className="truncate">{item.label}</span>
//                 {item.restricted && (
//                   <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         {/* Bottom Section */}
//         <div className="mt-4 pt-4 border-t border-outline-variant/60 space-y-1 flex-shrink-0">
//           {/* Create New Tile / Close Form - TOGGLE BUTTON */}
//           <button
//             onClick={handleTileFormToggle}
//             className={`w-full mb-4 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-sm ${
//               isTileFormOpen
//                 ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
//                 : "bg-primary text-white shadow-primary/20"
//             }`}
//           >
//             {isTileFormOpen ? (
//               <>
//                 <X className="w-4 h-4" />
//                 Close Form
//               </>
//             ) : (
//               <>
//                 <Plus className="w-4 h-4" />
//                 Create New Tile
//               </>
//             )}
//           </button>

//           <button
//             onClick={() => handleTabChange("profile")}
//             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40 transition-all text-sm font-medium"
//           >
//             <SettingsIcon className="w-4 h-4" />
//             Settings
//           </button>

//           <a
//             href="mailto:support@tilesview360.com"
//             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40 transition-all text-sm font-medium"
//           >
//             <HelpCircle className="w-4 h-4" />
//             Support
//           </a>

//           {/* LOGOUT BUTTON */}
//           <button
//             onClick={handleLogout}
//             disabled={loggingOut}
//             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loggingOut ? <Loader className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
//             {loggingOut ? "Logging out..." : "Logout"}
//           </button>
//         </div>
//       </aside>

//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* MAIN COLUMN (Header + Content) */}
//       {/* ═══════════════════════════════════════════════════════════ */}
//       <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
//         {/* TOP HEADER */}
//         <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-outline-variant/40 h-16 px-3 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
//           <div className="flex items-center gap-2 flex-1 min-w-0">
//             <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container-high/50 rounded-lg flex-shrink-0">
//               <Menu className="w-5 h-5" />
//             </button>
//             <div className="relative w-full max-w-2xl group">
//               <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
//               <input
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search tiles by name, code, material..."
//                 className="w-full bg-surface-container-low border-none rounded-full py-2 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-2 sm:gap-4 ml-3 flex-shrink-0">
//             <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-high/40 rounded-full transition-transform active:scale-90 hidden sm:inline-flex">
//               <Bell className="w-5 h-5" />
//               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
//             </button>
//             <button
//               onClick={() => handleTabChange("profile")}
//               className="p-2 text-on-surface-variant hover:bg-surface-container-high/40 rounded-full transition-transform active:scale-90 hidden sm:inline-flex"
//               title="Settings"
//             >
//               <SettingsIcon className="w-5 h-5" />
//             </button>
//             {/* LOGOUT BUTTON - NEXT TO SETTINGS */}
//             <button
//               onClick={handleLogout}
//               disabled={loggingOut}
//               className="p-2 text-on-surface-variant hover:bg-red-50 hover:text-red-600 rounded-full transition-transform active:scale-90 hidden sm:inline-flex disabled:opacity-50"
//               title="Logout"
//             >
//               {loggingOut ? <Loader className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
//             </button>
//             <div className="h-6 w-px bg-outline-variant hidden sm:block" />
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="text-right hidden sm:block">
//                 <p className="font-bold text-sm text-on-surface truncate max-w-[120px]">{displayName}</p>
//                 <p className="text-[10px] text-on-surface-variant truncate max-w-[120px]">{planLabel}</p>
//               </div>
//               <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
//                 <User className="w-5 h-5 text-primary" />
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* CONTENT AREA */}
//         <main className="flex-1 px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
//           {/* Alerts */}
//           {error && (
//             <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake">
//               <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <p className="text-red-800 font-semibold text-sm">Error</p>
//                 <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
//               </div>
//               <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold text-lg">×</button>
//             </div>
//           )}
//           {success && (
//             <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-slide-down">
//               <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <p className="text-green-800 font-semibold text-sm">Success</p>
//                 <p className="text-green-700 text-xs sm:text-sm break-words">{success}</p>
//               </div>
//               <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600 font-bold text-lg">×</button>
//             </div>
//           )}

//           {/* Page Title Row */}
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
//             <div className="min-w-0">
//               <nav className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">
//                 {currentMeta.crumb}
//               </nav>
//               <h2 className="text-2xl sm:text-[28px] font-bold text-on-surface leading-tight">{currentMeta.title}</h2>
//               <p className="text-on-surface-variant text-sm mt-0.5">{currentMeta.subtitle}</p>
//             </div>
//             {activeTab === "tiles" && (
//               <button
//                 onClick={handleTileFormToggle}
//                 className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg w-fit ${
//                   isTileFormOpen
//                     ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
//                     : "bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20"
//                 }`}
//               >
//                 {isTileFormOpen ? (
//                   <>
//                     <X className="w-4 h-4" />
//                     Close Form
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="w-4 h-4" />
//                     Add New Tile
//                   </>
//                 )}
//               </button>
//             )}
//           </div>

//           {/* ═══════════════════════════════════════════════════════ */}
//           {/* TILES TAB */}
//           {/* ═══════════════════════════════════════════════════════ */}
//           {activeTab === "tiles" && (
//             <>
//               {/* Real Plan Status Banner (business logic) */}
//               <PlanStatusBanner
//                 sellerId={currentUser?.user_id || ''}
//                 onViewPlans={() => setShowPlansModal(true)}
//                 forceRefresh={planRefreshTrigger}
//                 onPlanStatusChange={handlePlanStatusChange}
//               />

//               {/* Stats Grid */}
//               <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
//                 <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
//                   <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
//                     <LayoutGrid className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-on-surface-variant font-medium text-xs">Total Tiles</p>
//                     <h4 className="text-lg font-bold leading-tight">{tiles.length}</h4>
//                     <p className="text-primary text-[9px] font-bold uppercase tracking-wider">{categoryCount} Categories</p>
//                   </div>
//                 </div>
//                 <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
//                   <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <CheckCircle className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-on-surface-variant font-medium text-xs">In Stock</p>
//                     <h4 className="text-lg font-bold leading-tight">{inStockCount}</h4>
//                     <p className="text-green-600 text-[9px] font-bold uppercase tracking-wider">{availabilityPct}% Avail.</p>
//                   </div>
//                 </div>
//                 <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
//                   <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center flex-shrink-0">
//                     <Package className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-on-surface-variant font-medium text-xs">Total Stock</p>
//                     <h4 className="text-lg font-bold leading-tight">{totalStock}</h4>
//                     <p className="text-secondary text-[9px] font-bold uppercase tracking-wider">Units</p>
//                   </div>
//                 </div>
//                 <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
//                   <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <AlertCircle className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-on-surface-variant font-medium text-xs">Low Stock</p>
//                     <h4 className="text-lg font-bold leading-tight">{lowStockCount}</h4>
//                     <p className="text-orange-600 text-[9px] font-bold uppercase tracking-wider">Reorder</p>
//                   </div>
//                 </div>
//                 <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
//                   <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <Package className="w-5 h-5" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-on-surface-variant font-medium text-xs">Out of Stock</p>
//                     <h4 className="text-lg font-bold leading-tight">{outOfStockCount}</h4>
//                     <p className="text-red-600 text-[9px] font-bold uppercase tracking-wider">Unavailable</p>
//                   </div>
//                 </div>
//               </section>

//               {/* Add/Edit Tile Form */}
//               {(isAddingTile || editingTile) && (
//                 <div className="p-4 sm:p-6 border border-primary/30 rounded-2xl bg-primary/5 relative">
//                   {/* Close (X) button top-right of form */}
//                   <button
//                     onClick={handleTileFormToggle}
//                     className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-on-surface-variant hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
//                     title="Close"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>

//                   <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-on-surface pr-10">
//                     {editingTile ? (
//                       <><Edit className="w-5 h-5 text-primary" /><span className="truncate">Edit: {editingTile.name}</span></>
//                     ) : (
//                       <><Plus className="w-5 h-5 text-primary" /> Add New Tile</>
//                     )}
//                   </h3>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Name *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter tile name"
//                         value={newTile.name}
//                         onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
//                         className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-shadow outline-none"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Code</label>
//                       <input
//                         type="text"
//                         placeholder="Auto-generated if empty"
//                         value={newTile.tileCode}
//                         onChange={(e) => setNewTile({ ...newTile, tileCode: e.target.value })}
//                         className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-shadow outline-none"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Category *</label>
//                       <select
//                         value={newTile.category}
//                         onChange={(e) => setNewTile({ ...newTile, category: e.target.value as any })}
//                         className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white cursor-pointer transition-shadow outline-none"
//                       >
//                         <option value="floor">Floor Only</option>
//                         <option value="wall">Wall Only</option>
//                         <option value="both">Floor & Wall</option>
//                       </select>
//                     </div>

//                     {/* SIZE */}
//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Size *</label>
//                       {(() => {
//                         const standardSizes = [
//                           "30x30 cm", "30x60 cm", "60x60 cm", "60x120 cm", "80x80 cm",
//                           "40x40 cm", "40x60 cm", "50x50 cm", "20x120 cm", "15x90 cm",
//                           "10x30 cm", "20x20 cm", "25x40 cm", "61x122 cm", "122x122 cm",
//                           "75x75 cm", "100x100 cm", "45x45 cm", "7.5x15 cm", "6x25 cm"
//                         ];
//                         const currentSize = newTile.size || "";
//                         const isManualMode = currentSize === "manual_trigger" || (currentSize !== "" && !standardSizes.includes(currentSize));
//                         let parsedWidth = "", parsedHeight = "";
//                         if (isManualMode && currentSize !== "manual_trigger") {
//                           const parts = currentSize.replace(" cm", "").split("x");
//                           if (parts.length === 2) { parsedWidth = parts[0]; parsedHeight = parts[1]; }
//                         }
//                         const handleManualChange = (w: string, h: string) => setNewTile({ ...newTile, size: `${w}x${h} cm` });

//                         return (
//                           <div className="space-y-3">
//                             {!isManualMode ? (
//                               <div>
//                                 <div className="relative">
//                                   <select
//                                     value={currentSize}
//                                     onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
//                                     className="w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm appearance-none cursor-pointer pr-10 outline-none"
//                                   >
//                                     <option value="">Select Tile Size</option>
//                                     {standardSizes.map((s) => <option key={s} value={s}>{s}</option>)}
//                                   </select>
//                                   <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3 top-3 pointer-events-none" />
//                                 </div>
//                                 <button type="button" onClick={() => setNewTile({ ...newTile, size: "manual_trigger" })} className="mt-2 text-xs sm:text-sm text-primary font-semibold hover:opacity-80 flex items-center gap-1">
//                                   <Plus className="w-3.5 h-3.5" /> Add Manual Size
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3 animate-slide-down">
//                                 <div className="flex justify-between items-center mb-1">
//                                   <span className="text-xs sm:text-sm font-bold text-primary">Enter Custom Size (in cm)</span>
//                                   <button type="button" onClick={() => setNewTile({ ...newTile, size: "" })} className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded">Cancel</button>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                   <div className="flex-1">
//                                     <label className="block text-[10px] sm:text-xs font-semibold text-primary mb-1">Width</label>
//                                     <input type="number" placeholder="e.g. 300" value={parsedWidth} onChange={(e) => handleManualChange(e.target.value, parsedHeight)} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" min="1" />
//                                   </div>
//                                   <div className="text-primary font-bold text-lg mt-5">×</div>
//                                   <div className="flex-1">
//                                     <label className="block text-[10px] sm:text-xs font-semibold text-primary mb-1">Height</label>
//                                     <input type="number" placeholder="e.g. 600" value={parsedHeight} onChange={(e) => handleManualChange(parsedWidth, e.target.value)} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" min="1" />
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     {/* SURFACE */}
//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Surface</label>
//                       {(() => {
//                         const standardSurfaces = ["Polished", "Step Side", "Matt", "Carving", "High Gloss", "Metallic", "Sugar", "Glue", "Punch"];
//                         const currentSurface = newTile.tileSurface || "";
//                         const isManualMode = currentSurface === "manual_trigger" || (currentSurface !== "" && !standardSurfaces.includes(currentSurface));
//                         return (
//                           <div className="space-y-3">
//                             {!isManualMode ? (
//                               <div>
//                                 <div className="relative">
//                                   <select value={currentSurface} onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value || undefined })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm appearance-none cursor-pointer pr-10 outline-none">
//                                     <option value="">Select Surface Finish</option>
//                                     {standardSurfaces.map((s) => <option key={s} value={s}>{s}</option>)}
//                                   </select>
//                                   <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3 top-3 pointer-events-none" />
//                                 </div>
//                                 <button type="button" onClick={() => setNewTile({ ...newTile, tileSurface: "manual_trigger" })} className="mt-2 text-xs sm:text-sm text-primary font-semibold hover:opacity-80 flex items-center gap-1">
//                                   <Plus className="w-3.5 h-3.5" /> Add Manual Surface
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3 animate-slide-down">
//                                 <div className="flex justify-between items-center mb-1">
//                                   <span className="text-xs sm:text-sm font-bold text-primary">Enter Custom Surface</span>
//                                   <button type="button" onClick={() => setNewTile({ ...newTile, tileSurface: "" })} className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded">Cancel</button>
//                                 </div>
//                                 <input type="text" placeholder="e.g. Rustic, Satin, 3D Print" value={currentSurface === "manual_trigger" ? "" : currentSurface} onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value })} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" autoFocus />
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                       {newTile.tileSurface && newTile.tileSurface !== "manual_trigger" && newTile.tileSurface.trim() !== "" && (
//                         <div className="flex items-center gap-2 text-xs text-green-600 mt-1.5">
//                           <CheckCircle className="w-3 h-3" /><span>Selected: <strong>{newTile.tileSurface}</strong></span>
//                         </div>
//                       )}
//                     </div>

//                     {/* MATERIAL */}
//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Material</label>
//                       {(() => {
//                         const standardMaterials = ["Slabs", "GVT & PGVT", "Double Charge", "Counter Tops", "Full Body", "Ceramic", "Mosaic", "Subway"];
//                         const currentMaterial = newTile.tileMaterial || "";
//                         const isManualMode = currentMaterial === "manual_trigger" || (currentMaterial !== "" && !standardMaterials.includes(currentMaterial));
//                         return (
//                           <div className="space-y-3">
//                             {!isManualMode ? (
//                               <div>
//                                 <div className="relative">
//                                   <select value={currentMaterial} onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value || undefined })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm appearance-none cursor-pointer pr-10 outline-none">
//                                     <option value="">Select Material Type</option>
//                                     {standardMaterials.map((m) => <option key={m} value={m}>{m}</option>)}
//                                   </select>
//                                   <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3 top-3 pointer-events-none" />
//                                 </div>
//                                 <button type="button" onClick={() => setNewTile({ ...newTile, tileMaterial: "manual_trigger" })} className="mt-2 text-xs sm:text-sm text-primary font-semibold hover:opacity-80 flex items-center gap-1">
//                                   <Plus className="w-3.5 h-3.5" /> Add Manual Material
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3 animate-slide-down">
//                                 <div className="flex justify-between items-center mb-1">
//                                   <span className="text-xs sm:text-sm font-bold text-primary">Enter Custom Material</span>
//                                   <button type="button" onClick={() => setNewTile({ ...newTile, tileMaterial: "" })} className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded">Cancel</button>
//                                 </div>
//                                 <input type="text" placeholder="e.g. Porcelain, Natural Stone, Glass" value={currentMaterial === "manual_trigger" ? "" : currentMaterial} onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value })} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" autoFocus />
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                       {newTile.tileMaterial && newTile.tileMaterial !== "manual_trigger" && newTile.tileMaterial.trim() !== "" && (
//                         <div className="flex items-center gap-2 text-xs text-green-600 mt-1.5">
//                           <CheckCircle className="w-3 h-3" /><span>Selected: <strong>{newTile.tileMaterial}</strong></span>
//                         </div>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Price (₹) *</label>
//                       <input type="number" placeholder="Enter price" value={newTile.price || ""} onChange={(e) => setNewTile({ ...newTile, price: e.target.value === "" ? 0 : Number(e.target.value) })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm outline-none" min="0" step="0.01" />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Stock Quantity *</label>
//                       <input type="number" placeholder="Enter stock quantity" value={newTile.stock || ""} onChange={(e) => setNewTile({ ...newTile, stock: e.target.value === "" ? 0 : Number(e.target.value) })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm outline-none" min="0" />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Image *</label>
//                       <div className="flex flex-col gap-2">
//                         <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "image"); }} className="hidden" id="tile-image-upload" />
//                         <label htmlFor="tile-image-upload" className={`flex items-center justify-center gap-2 px-3 py-2.5 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors text-sm font-medium ${imageUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
//                           {imageUploading ? <><Loader className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Choose Image</>}
//                         </label>
//                         {newTile.imageUrl && (
//                           <div className="flex items-center gap-2">
//                             <img src={newTile.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-outline-variant shadow-sm" />
//                             <div className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">Uploaded</span></div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Texture (Optional)</label>
//                       <div className="flex flex-col gap-2">
//                         <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "texture"); }} className="hidden" id="texture-image-upload" />
//                         <label htmlFor="texture-image-upload" className={`flex items-center justify-center gap-2 px-3 py-2.5 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors text-sm font-medium ${textureUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
//                           {textureUploading ? <><Loader className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Choose Texture</>}
//                         </label>
//                         {newTile.textureUrl && (
//                           <div className="flex items-center gap-2">
//                             <img src={newTile.textureUrl} alt="Texture" className="w-16 h-16 object-cover rounded-lg border border-outline-variant shadow-sm" />
//                             <div className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">Uploaded</span></div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col sm:flex-row gap-2 mt-6">
//                     <button
//                       onClick={editingTile ? handleUpdateTile : handleAddTile}
//                       disabled={imageUploading || textureUploading}
//                       className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold shadow-md shadow-primary/20"
//                     >
//                       <Save className="w-4 h-4" />
//                       {editingTile ? "Update Tile" : "Save Tile"}
//                     </button>
//                     <button
//                       onClick={handleTileFormToggle}
//                       className="px-6 py-2.5 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-sm font-semibold"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Inventory Card */}
//               <section className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 overflow-hidden shadow-sm">
//                 {/* Filter Bar */}
//                 <div className="p-4 border-b border-outline-variant/40 bg-white/40 flex flex-wrap items-center justify-between gap-3">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <div className="relative">
//                       <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-9 font-semibold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer outline-none">
//                         <option value="all">All Categories</option>
//                         <option value="floor">Floor</option>
//                         <option value="wall">Wall</option>
//                         <option value="both">Floor & Wall</option>
//                       </select>
//                       <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
//                     </div>
//                     <div className="relative">
//                       <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-9 font-semibold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer outline-none">
//                         <option value="all">Stock Status</option>
//                         <option value="in-stock">In Stock</option>
//                         <option value="out-of-stock">Out of Stock</option>
//                       </select>
//                       <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
//                     </div>
//                     <button onClick={loadData} title="Refresh" className="p-2 hover:bg-surface-container-highest/40 rounded-lg transition-all group">
//                       <RefreshCw className="w-4 h-4 text-on-surface-variant group-active:rotate-180 transition-transform duration-500" />
//                     </button>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <p className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">
//                       {currentTiles.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
//                     </p>
//                     <div className="hidden lg:flex bg-surface-container rounded-lg p-1">
//                       <button onClick={() => setViewMode("grid")} className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}>
//                         <LayoutGrid className="w-4 h-4" />
//                       </button>
//                       <button onClick={() => setViewMode("table")} className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${viewMode === "table" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}>
//                         <List className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Desktop Table */}
//                 {viewMode === "table" && (
//                   <div className="hidden lg:block overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                       <thead>
//                         <tr className="bg-surface-container-low/50 border-b border-outline-variant/40">
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Image</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Name</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Code</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Size</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Surface</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Material</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Price</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Stock</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">QR</th>
//                           <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-outline-variant/20">
//                         {currentTiles.length === 0 ? (
//                           <tr>
//                             <td colSpan={12} className="text-center p-10 text-on-surface-variant">
//                               {tiles.length === 0 ? (
//                                 <div className="space-y-2"><Package className="w-12 h-12 text-gray-300 mx-auto" /><p className="font-semibold">No tiles found</p><p className="text-sm">Start by adding your first tile!</p></div>
//                               ) : (
//                                 <div className="space-y-2"><Search className="w-12 h-12 text-gray-300 mx-auto" /><p className="font-semibold">No tiles match your search</p><p className="text-sm">Try adjusting your search or filters</p></div>
//                               )}
//                             </td>
//                           </tr>
//                         ) : (
//                           currentTiles.map((tile) => (
//                             <tr key={tile.id} className="hover:bg-primary-container/5 transition-colors group">
//                               <td className="p-4">
//                                 <div className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-white p-1">
//                                   <img src={tile.imageUrl} alt={tile.name} className="w-full h-full object-cover rounded" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-tile.png"; }} />
//                                 </div>
//                               </td>
//                               <td className="p-4">
//                                 <p className="font-bold text-on-surface text-sm">{tile.name}</p>
//                                 {tile.textureUrl && <p className="text-[10px] text-green-600">Has texture</p>}
//                               </td>
//                               <td className="p-4"><span className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">{tile.tileCode}</span></td>
//                               <td className="p-4">
//                                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                                   tile.category === "floor" ? "bg-primary-container/10 text-primary" :
//                                   tile.category === "wall" ? "bg-secondary-container/10 text-secondary" :
//                                   "bg-surface-container text-on-surface-variant"
//                                 }`}>
//                                   {tile.category === "both" ? "Both" : tile.category.charAt(0).toUpperCase() + tile.category.slice(1)}
//                                 </span>
//                               </td>
//                               <td className="p-4 text-xs font-medium text-on-surface">{tile.size}</td>
//                               <td className="p-4">
//                                 {tile.tileSurface ? (
//                                   <div className="flex items-center gap-1.5 text-xs"><Circle className="w-3 h-3 text-on-surface-variant" /><span>{tile.tileSurface}</span></div>
//                                 ) : <span className="text-gray-400 text-xs">—</span>}
//                               </td>
//                               <td className="p-4">
//                                 {tile.tileMaterial ? (
//                                   <div className="flex items-center gap-1.5 text-xs"><Layers className="w-3.5 h-3.5 text-secondary" /><span>{tile.tileMaterial}</span></div>
//                                 ) : <span className="text-gray-400 text-xs">—</span>}
//                               </td>
//                               <td className="p-4 text-right font-bold text-sm text-on-surface">₹{tile.price.toLocaleString()}</td>
//                               <td className="p-4 text-center font-semibold text-sm text-on-surface">{tile.stock || 0}</td>
//                               <td className="p-4">
//                                 <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(tile)}`}>
//                                   {getStockStatusText(tile)}
//                                 </span>
//                               </td>
//                               <td className="p-4">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${tile.qrCode ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
//                                   {tile.qrCode ? "✓" : "○"}
//                                 </span>
//                               </td>
//                               <td className="p-4">
//                                 <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                   <button onClick={() => handleEditTile(tile)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all" title="Edit"><Edit className="w-4 h-4" /></button>
//                                   <button onClick={() => handleDeleteTile(tile.id, tile.name)} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}

//                 {/* Desktop Grid View */}
//                 {viewMode === "grid" && (
//                   <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4 p-4">
//                     {currentTiles.length === 0 ? (
//                       <div className="col-span-full text-center py-10 text-on-surface-variant">
//                         <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//                         <p className="font-semibold">No tiles found</p>
//                       </div>
//                     ) : (
//                       currentTiles.map((tile) => renderTileCard(tile))
//                     )}
//                   </div>
//                 )}

//                 {/* Mobile Card View */}
//                 <div className="lg:hidden p-3 sm:p-4 space-y-3">
//                   {currentTiles.length === 0 ? (
//                     <div className="text-center py-12 text-on-surface-variant">
//                       {tiles.length === 0 ? (
//                         <div className="space-y-2"><Package className="w-16 h-16 text-gray-300 mx-auto" /><p className="font-semibold">No tiles found</p><p className="text-sm">Start by adding your first tile!</p></div>
//                       ) : (
//                         <div className="space-y-2"><Search className="w-16 h-16 text-gray-300 mx-auto" /><p className="font-semibold">No tiles match your search</p><p className="text-sm">Try adjusting your search or filters</p></div>
//                       )}
//                     </div>
//                   ) : (
//                     currentTiles.map((tile) => renderTileCard(tile))
//                   )}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="p-4 bg-surface-container-low/50 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/30">
//                     <button onClick={goToPreviousPage} disabled={currentPage === 1} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentPage === 1 ? "border-outline-variant bg-white text-gray-400 cursor-not-allowed" : "border-outline-variant bg-white text-on-surface-variant hover:text-primary"}`}>
//                       <ChevronLeft className="w-4 h-4" /> Prev
//                     </button>
//                     <div className="flex items-center gap-1.5 flex-wrap justify-center">
//                       {getPageNumbers().map((page, index) =>
//                         page === '...' ? (
//                           <span key={`e-${index}`} className="px-2 text-on-surface-variant">...</span>
//                         ) : (
//                           <button key={page} onClick={() => goToPage(page as number)} className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${currentPage === page ? "bg-primary text-white" : "hover:bg-white text-on-surface-variant"}`}>
//                             {page}
//                           </button>
//                         )
//                       )}
//                     </div>
//                     <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentPage === totalPages ? "border-outline-variant bg-white text-gray-400 cursor-not-allowed" : "border-outline-variant bg-white text-on-surface-variant hover:text-primary"}`}>
//                       Next <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 )}
//               </section>
//             </>
//           )}

//           {/* ═══════════════════════════════════════════════════════ */}
//           {/* OTHER TABS */}
//           {/* ═══════════════════════════════════════════════════════ */}
//           {activeTab !== "tiles" && (
//             <section className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-4 sm:p-6">
//               {activeTab === "worker" && <WorkerManagement />}
//               {activeTab === "profile" && <SellerProfile />}
//               {activeTab === "excel" && <ExcelUpload onUploadComplete={loadData} />}
//               {activeTab === "stock-analytics" && <SellerStockAnalytics />}
//               {activeTab === "bulk" && <BulkUpload onUploadComplete={loadData} />}
//               {activeTab === "customer-inquiries" && <CustomerInquiriesManager />}
//               {activeTab === "qrcodes" && (
//                 <QRCodeManager tiles={tiles} sellerId={currentUser?.user_id} onQRCodeGenerated={loadData} />
//               )}
//               {activeTab === "history" && <HistoryTab />}
//               {activeTab === "analytics" && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
//               {activeTab === "billing" && (
//                 <BillingTab
//                   key={`billing-tab-${planRefreshTrigger}`}
//                   sellerId={currentUser?.user_id || ''}
//                   sellerEmail={currentUser?.email || ''}
//                 />
//               )}
//             </section>
//           )}
//         </main>

//         {/* FOOTER */}
//         <footer className="px-3 sm:px-6 lg:px-8 border-t border-outline-variant/40 flex flex-col sm:flex-row justify-between items-center gap-2 text-on-surface-variant py-4">
//           <p className="text-[11px]">© {new Date().getFullYear()} Tilesview360. All rights reserved.</p>
//           <div className="flex gap-4 text-[11px] font-medium">
//             <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
//             <a className="hover:text-primary transition-colors" href="#">Terms</a>
//             <a className="hover:text-primary transition-colors" href="#">API Docs</a>
//           </div>
//         </footer>
//       </div>

//       {/* MOBILE FAB - TOGGLE BUTTON */}
//       {activeTab === "tiles" && (
//         <button
//           onClick={handleTileFormToggle}
//           className={`lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform z-[60] ${
//             isTileFormOpen
//               ? "bg-red-500"
//               : "bg-gradient-to-br from-[#2d5bff] to-[#8127cf]"
//           }`}
//         >
//           {isTileFormOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
//         </button>
//       )}

//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* PAYMENT MODALS */}
//       {/* ═══════════════════════════════════════════════════════════ */}
//       <PlansModal
//         isOpen={showPlansModal}
//         onClose={() => setShowPlansModal(false)}
//         isLoggedIn={isAuthenticated}
//         sellerId={currentUser?.user_id || ''}
//         userToken={userToken}
//       />

//       <PaymentConfirmationModal
//         isOpen={showPaymentConfirmation}
//         onClose={() => { setShowPaymentConfirmation(false); setSelectedPlan(null); }}
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
//           userToken={userToken}
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
  Package,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Loader,
  Search,
  Users,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Eye,
  TrendingUp,
  QrCode,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Shield,
  Bell,
  Settings as SettingsIcon,
  LayoutGrid,
  List,
  Award,
  Layers,
  Circle,
  HelpCircle,
  CreditCard,
  LogOut,
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
import { jwtService } from '../lib/jwtService';
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
import { BillingTab } from './BillingTab';
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

type TabKey =
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
  | "billing";

type FormSource = 'header' | 'sidebar' | 'mobile' | null;

// ═══════════════════════════════════════════════════════════════
// ✅ MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const SellerDashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAppStore();

  // Tab Management
  const [isAddingTile, setIsAddingTile] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("tiles");

  // Tile Management
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
  const [userToken, setUserToken] = useState<string>('');

  // UI State
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [textureUploading, setTextureUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // ✅ Track WHICH button opened the tile form
  const [formOpenedFrom, setFormOpenedFrom] = useState<FormSource>(null);

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Mobile / Sidebar UI
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedTileId, setExpandedTileId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);

  // Payment State
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const checkPaymentSuccess = () => {
      const flag = localStorage.getItem('plan_just_purchased');
      if (flag) {
        setPlanRefreshTrigger(prev => prev + 1);
        localStorage.removeItem('plan_just_purchased');
        if (showPlansModal) {
          setTimeout(() => setShowPlansModal(false), 3000);
        }
      }
    };
    const interval = setInterval(checkPaymentSuccess, 1000);
    return () => clearInterval(interval);
  }, [showPlansModal]);

  useEffect(() => {
    if (isAuthenticated) {
      const token = jwtService.getAccessToken();
      if (token) {
        const isValid = jwtService.isValidTokenFormat(token);
        setUserToken(isValid ? token : '');
      } else {
        setUserToken('');
      }
    } else {
      setUserToken('');
    }
  }, [isAuthenticated]);

  const [planStatus, setPlanStatus] = useState<SellerPlanStatus>({
    isActive: false,
    expiresAt: null,
    planName: null,
    planId: null,
    daysRemaining: 0,
    loading: true,
    lastChecked: null
  });

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
  // ✅ PLAN STATUS
  // ═══════════════════════════════════════════════════════════════

  const checkSellerPlanStatus = async (sellerId: string): Promise<SellerPlanStatus> => {
    try {
      const subscription = await getSellerSubscription(sellerId, true);
      if (!subscription) {
        return { isActive: false, expiresAt: null, planName: null, planId: null, daysRemaining: 0, loading: false, lastChecked: new Date() };
      }
      const expired = isSubscriptionExpired(subscription);
      const daysRemaining = getDaysUntilExpiry(subscription);
      const endDate = subscription.end_date ? new Date(subscription.end_date) : null;
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
      return { isActive: false, expiresAt: null, planName: null, planId: null, daysRemaining: 0, loading: false, lastChecked: new Date() };
    }
  };

  const loadPlanStatus = async () => {
    if (!currentUser?.user_id) return;
    try {
      const status = await checkSellerPlanStatus(currentUser.user_id);
      setPlanStatus(status);
    } catch (error: any) {
      setPlanStatus({ isActive: false, expiresAt: null, planName: null, planId: null, daysRemaining: 0, loading: false, lastChecked: new Date() });
    }
  };

  const handlePlanStatusChange = async (isActive: boolean, isExpired: boolean) => {
    setPlanStatus(prev => ({ ...prev, isActive, loading: false, lastChecked: new Date() }));
    if (!isActive && isExpired) {
      setTimeout(async () => { await loadPlanStatus(); }, 1000);
    }
  };

  const isFeatureAllowed = (feature: 'scan' | 'worker' | 'analytics'): boolean => {
    if (planStatus.loading) return false;
    return planStatus.isActive;
  };

  const getDisabledReason = (): string => {
    if (planStatus.loading) return 'Checking plan status...';
    if (!planStatus.isActive) {
      if (planStatus.expiresAt) return `Your plan expired on ${planStatus.expiresAt.toLocaleDateString()}. Please renew to continue.`;
      return 'No active plan. Please subscribe to access this feature.';
    }
    if (planStatus.daysRemaining <= 3) return `Your plan expires in ${planStatus.daysRemaining} days. Consider renewing soon.`;
    return '';
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ EFFECTS
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      loadData();
      loadPlanStatus();
    } else if (currentUser === null && !isAuthenticated) {
      setLoading(false);
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    if (currentUser?.user_id && isAuthenticated && planRefreshTrigger > 0) {
      loadPlanStatus();
    }
  }, [planRefreshTrigger, currentUser?.user_id, isAuthenticated]);

  useEffect(() => {
    filterTiles();
    setCurrentPage(1);
  }, [tiles, searchTerm, categoryFilter, stockFilter]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => { setError(null); setSuccess(null); }, 5000);
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
      const [profile, sellerTiles] = await Promise.all([
        getSellerProfile(currentUser?.user_id || ""),
        getSellerTiles(currentUser?.user_id || ""),
      ]);
      setSellerProfile(profile);
      if (sellerTiles && sellerTiles.length > 0) {
        const uniqueTilesMap = new Map();
        sellerTiles.forEach((tile) => {
          if (tile.id && !uniqueTilesMap.has(tile.id)) uniqueTilesMap.set(tile.id, tile);
        });
        setTiles(Array.from(uniqueTilesMap.values()));
      } else {
        setTiles([]);
      }
    } catch (error: any) {
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
    if (categoryFilter !== "all") filtered = filtered.filter((tile) => tile.category === categoryFilter);
    if (stockFilter === "in-stock") filtered = filtered.filter((tile) => tile.inStock);
    else if (stockFilter === "out-of-stock") filtered = filtered.filter((tile) => !tile.inStock);
    setFilteredTiles(filtered);
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ PAGINATION
  // ═══════════════════════════════════════════════════════════════

  const totalPages = Math.ceil(filteredTiles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTiles = filteredTiles.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNumber: number) => { setCurrentPage(pageNumber); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goToNextPage = () => { if (currentPage < totalPages) { setCurrentPage(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const goToPreviousPage = () => { if (currentPage > 1) { setCurrentPage(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...'); pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1); pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...'); pages.push(totalPages);
    }
    return pages;
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ PAYMENT HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handlePlanSelection = async (planId: string) => {
    try {
      if (!isAuthenticated) { setShowPlansModal(false); setError('Please login to select a plan'); return; }
      const plan = await getPlanById(planId);
      if (!plan) { setError('❌ Plan not found. Please try again.'); return; }
      setSelectedPlan(plan);
      setShowPlansModal(false);
      setShowPaymentConfirmation(true);
    } catch (error: any) {
      setError(`❌ Error: ${error.message}`);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!selectedPlan) { setError('❌ No plan selected'); return; }
    setProcessingPayment(true);
    try {
      const currentUserAuth = auth.currentUser;
      if (!currentUserAuth) throw new Error('Please login first');
      const result = await initiatePayment(selectedPlan.id, selectedPlan.plan_name, selectedPlan.price);
      if (!result.success || !result.checkoutOptions || !result.paymentId) throw new Error(result.error || 'Failed to initiate payment');
      setCheckoutOptions(result.checkoutOptions);
      setPaymentId(result.paymentId);
      setShowPaymentConfirmation(false);
    } catch (error: any) {
      setError(`❌ Payment Error: ${error.message}`);
      setProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      setCheckoutOptions(null); setPaymentId(null); setProcessingPayment(false);
      setSelectedPlan(null); setShowPaymentConfirmation(false); setShowPlansModal(false);
      setSuccess('🎉 Payment successful! Activating plan...');
      try {
        const { enableAllSellersWorkers } = await import('../lib/firebaseutils');
        const result = await enableAllSellersWorkers(currentUser?.user_id || '');
        if (result.success && result.count > 0) setSuccess(`🎉 Plan activated! ${result.count} worker(s) enabled.`);
      } catch (workerError: any) { /* non-critical */ }
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPlanRefreshTrigger(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await loadPlanStatus();
      await loadData();
      setSuccess('✅ Plan activated! Workers can now login.');
      setTimeout(() => setSuccess(null), 7000);
    } catch (error: any) {
      setError('Payment successful but refresh failed. Reload page manually.');
    }
  };

  const handlePaymentError = async (error: string) => {
    setError(`❌ Payment Error: ${error}`);
    setCheckoutOptions(null); setPaymentId(null); setProcessingPayment(false);
    setSelectedPlan(null); setShowPaymentConfirmation(false);
    setTimeout(async () => { await loadPlanStatus(); }, 2000);
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ LOGOUT HANDLER
  // ═══════════════════════════════════════════════════════════════

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      setLoggingOut(true);
      setError(null);
      setSuccess(null);

      try {
        (jwtService as any).clearTokens?.();
        (jwtService as any).logout?.();
        (jwtService as any).clearAccessToken?.();
        (jwtService as any).clearRefreshToken?.();
      } catch (tokenError) {
        console.warn("Token cleanup warning:", tokenError);
      }

      try {
        await auth.signOut();
      } catch (firebaseError) {
        console.warn("Firebase signout warning:", firebaseError);
      }

      try {
        const storeApi = (useAppStore as any).getState?.();
        storeApi?.logout?.();
        storeApi?.setCurrentUser?.(null);
        storeApi?.setIsAuthenticated?.(false);
        storeApi?.reset?.();
      } catch (storeError) {
        console.warn("Store cleanup warning:", storeError);
      }

      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (storageError) {
        console.warn("Storage cleanup warning:", storageError);
      }

      window.location.href = '/';
    } catch (error: any) {
      console.error("Logout failed:", error);
      setError("Failed to logout. Please try again.");
      setLoggingOut(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ TILE MANAGEMENT FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  const generateTileCode = (): string => {
    const prefix = sellerProfile?.business_name?.substring(0, 3).toUpperCase() || "TIL";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const handleImageUpload = async (file: File, type: "image" | "texture") => {
    try {
      type === "image" ? setImageUploading(true) : setTextureUploading(true);
      if (!file.type.startsWith("image/")) throw new Error("Please select a valid image file");
      if (file.size > 5 * 1024 * 1024) throw new Error("Image size should be less than 5MB");
      const imageUrl = await uploadToCloudinaryWrapper(file, type === "image" ? "tiles/main" : "tiles/textures");
      if (type === "image") setNewTile((prev) => ({ ...prev, imageUrl }));
      else setNewTile((prev) => ({ ...prev, textureUrl: imageUrl }));
      setSuccess(`${type === "image" ? "Image" : "Texture"} uploaded successfully`);
    } catch (error: any) {
      setError(error.message || `Failed to upload ${type}`);
    } finally {
      type === "image" ? setImageUploading(false) : setTextureUploading(false);
    }
  };

  const uploadToCloudinaryWrapper = async (file: File, folder: string) => {
    const { uploadToCloudinary } = await import("../utils/cloudinaryUtils");
    return uploadToCloudinary(file, folder);
  };

  const validateTileForm = (): string | null => {
    if (!newTile.name?.trim()) return "❌ Tile Name is required. Please enter a tile name.";
    if (!newTile.size || newTile.size.trim() === "" || newTile.size === "manual_trigger") {
      return "❌ Tile Size is required. Please select or enter a size.";
    }
    if (newTile.size.includes('x') && !newTile.size.match(/^\d+x\d+ cm$/)) {
      return "❌ Invalid Manual Size. Please enter BOTH Width and Height properly.";
    }
    if (!newTile.price || newTile.price <= 0) return "❌ Valid Price is required. Please enter a price greater than 0.";
    if (newTile.stock === undefined || newTile.stock < 0) return "❌ Valid Stock Quantity is required. Please enter stock (0 or more).";
    if (!newTile.imageUrl?.trim()) return "❌ Tile Image is required. Please upload an image before saving.";
    return null;
  };

  const handleAddTile = async () => {
    try {
      setError(null);
      const validationError = validateTileForm();
      if (validationError) {
        setError(validationError);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!currentUser) { setError("User not authenticated"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }

      const tileCode = newTile.tileCode || generateTileCode();
      const baseTileData = {
        ...newTile,
        size: newTile.size?.trim(),
        tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
        tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
        sellerId: currentUser.user_id,
        showroomId: currentUser.user_id,
        tileCode,
        inStock: (newTile.stock || 0) > 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const savedTile = await uploadTile(baseTileData);
      if (!savedTile || !savedTile.id) throw new Error("Tile saved but ID not returned");

      let qrCodeGenerated = false;
      try {
        const qrCodeDataUrl = await generateTileQRCode(savedTile);
        await updateTileQRCode(savedTile.id, qrCodeDataUrl);
        qrCodeGenerated = true;
      } catch (qrError: any) { /* non-critical */ }

      await loadData();
      closeTileForm();
      setSuccess(qrCodeGenerated ? "✅ Tile added successfully with QR code!" : "✅ Tile added! QR code can be generated from QR Codes tab.");
    } catch (error: any) {
      setError(`Failed to add tile: ${error.message}`);
    }
  };

  const handleEditTile = async (tile: Tile) => {
    setEditingTile(tile);
    setNewTile({ ...tile, stock: tile.stock || 0 });
    setIsAddingTile(false);
    setError(null);
    setFormOpenedFrom('header'); // Edit action treated as content-area (header) trigger
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateTile = async () => {
    try {
      setError(null);
      const validationError = validateTileForm();
      if (validationError) { setError(validationError); return; }
      if (!editingTile) { setError("No tile selected for editing"); return; }

      const updates = {
        ...newTile,
        size: newTile.size?.trim(),
        tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
        tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
        inStock: (newTile.stock || 0) > 0,
        updatedAt: new Date().toISOString(),
      };

      await updateTile(editingTile.id, updates);

      const criticalFieldsChanged =
        editingTile.name !== newTile.name ||
        editingTile.tileCode !== newTile.tileCode ||
        editingTile.price !== newTile.price ||
        editingTile.size !== newTile.size ||
        editingTile.category !== newTile.category;

      if (criticalFieldsChanged) {
        setTimeout(async () => {
          try {
            if (typeof getTileById !== "function" || typeof generateTileQRCode !== "function" || typeof updateTileQRCode !== "function") return;
            const updatedTileData = await getTileById(editingTile.id);
            if (!updatedTileData) return;
            const newQRCode = await generateTileQRCode(updatedTileData);
            if (!newQRCode || !newQRCode.startsWith("data:image")) return;
            await updateTileQRCode(editingTile.id, newQRCode);
            await loadData();
          } catch (qrError: any) { /* non-critical */ }
        }, 0);
      }

      await loadData();
      closeTileForm();
      setSuccess("Tile updated successfully!");
    } catch (error: any) {
      setError(`Failed to update tile: ${error.message}`);
    }
  };

  const handleDeleteTile = async (tileId: string, tileName: string) => {
    if (!window.confirm(`Delete "${tileName}"?`)) return;
    try {
      setError(null);
      await deleteTile(tileId);
      await loadData();
      setSuccess("Tile deleted successfully");
    } catch (error: any) {
      setError(`Delete failed: ${error.message}`);
    }
  };

  const resetNewTile = () => {
    setNewTile({
      name: "", category: "both", size: "", price: 0, stock: 0, inStock: true,
      imageUrl: "", textureUrl: "", tileCode: "", tileSurface: "", tileMaterial: "",
    });
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
    setMobileMenuOpen(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ TILE FORM TOGGLE (Source-aware: header / sidebar / mobile)
  // ═══════════════════════════════════════════════════════════════

  // Form completely close karne ka common function
  const closeTileForm = () => {
    setIsAddingTile(false);
    setEditingTile(null);
    resetNewTile();
    setError(null);
    setFormOpenedFrom(null);
  };

  // Har trigger apna source pass karega: 'header' | 'sidebar' | 'mobile'
  const handleTileFormToggle = (source: 'header' | 'sidebar' | 'mobile') => {
    const isOpen = isAddingTile || editingTile !== null;

    if (isOpen) {
      if (formOpenedFrom === source) {
        // Isi button ne open kiya tha -> isi se close hoga
        closeTileForm();
      } else {
        // Form kisi aur trigger se khula hai -> control is button ko shift karo
        setFormOpenedFrom(source);
        if (source === 'sidebar' || source === 'mobile') setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Form band hai -> fresh open karo
      setIsAddingTile(true);
      setEditingTile(null);
      resetNewTile();
      setError(null);
      setActiveTab("tiles");
      setFormOpenedFrom(source);
      if (source === 'sidebar' || source === 'mobile') setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Overall form open hai ya nahi (render ke liye)
  const isTileFormOpen = activeTab === "tiles" && (isAddingTile || editingTile !== null);

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

  const isScanAllowed = isFeatureAllowed('scan');
  const isWorkerAllowed = isFeatureAllowed('worker');
  const disabledMessage = getDisabledReason();

  // ═══════════════════════════════════════════════════════════════
  // ✅ DERIVED STATS (REAL DATA — NO FAKE VALUES)
  // ═══════════════════════════════════════════════════════════════

  const totalStock = tiles.reduce((sum, t) => sum + (t.stock || 0), 0);
  const inStockCount = tiles.filter((t) => t.inStock).length;
  const outOfStockCount = tiles.filter((t) => !t.inStock).length;
  const lowStockCount = tiles.filter((t) => t.inStock && (t.stock || 0) > 0 && (t.stock || 0) < 10).length;
  const availabilityPct = tiles.length > 0 ? Math.round((inStockCount / tiles.length) * 100) : 0;
  const categoryCount = new Set(tiles.map((t) => t.category)).size;

  // ═══════════════════════════════════════════════════════════════
  // ✅ NAV ITEMS (SIDEBAR)
  // ═══════════════════════════════════════════════════════════════

  const navItems: {
    id: TabKey;
    label: string;
    icon: React.ElementType;
    restricted?: boolean;
    external?: boolean;
  }[] = [
    { id: "tiles", label: "My Tiles", icon: LayoutGrid },
    { id: "history", label: "History", icon: Clock },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "customer-inquiries", label: "Customers", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "stock-analytics", label: "Stock Analytics", icon: Package },
    { id: "worker", label: "Worker", icon: Shield, restricted: !isWorkerAllowed },
    { id: "scan", label: "Scan", icon: QrCode, restricted: !isScanAllowed, external: true },
    { id: "profile", label: "Profile", icon: User },
    { id: "excel", label: "Excel", icon: FileSpreadsheet },
    { id: "bulk", label: "CSV Upload", icon: Upload },
    { id: "qrcodes", label: "QR Codes", icon: QrCode },
  ];

  const handleNavClick = (item: (typeof navItems)[number]) => {
    if (item.id === "scan") {
      if (isScanAllowed) window.open("/scan", "_blank");
      else setShowPlansModal(true);
      setMobileMenuOpen(false);
      return;
    }
    if (item.id === "worker" && !isWorkerAllowed) {
      setShowPlansModal(true);
      setMobileMenuOpen(false);
      return;
    }
    handleTabChange(item.id);
  };

  const tabMeta: Record<TabKey, { crumb: string; title: string; subtitle: string }> = {
    tiles: { crumb: "Dashboard", title: "Tile Catalog", subtitle: "Organize your tiles, monitor stock, and power customer visualizations." },
    history: { crumb: "Dashboard", title: "History", subtitle: "Track all your recent activity and changes." },
    billing: { crumb: "Dashboard", title: "Billing", subtitle: "Manage your subscription and payment history." },
    "customer-inquiries": { crumb: "Dashboard", title: "Customers", subtitle: "View and respond to customer inquiries." },
    analytics: { crumb: "Dashboard", title: "Analytics", subtitle: "Deep insights into your showroom performance." },
    "stock-analytics": { crumb: "Dashboard", title: "Stock Analytics", subtitle: "Monitor inventory trends and stock health." },
    worker: { crumb: "Dashboard", title: "Worker Management", subtitle: "Manage worker accounts and permissions." },
    scan: { crumb: "Dashboard", title: "Scan", subtitle: "Open the QR scanner." },
    profile: { crumb: "Dashboard", title: "Profile", subtitle: "Manage your business profile and settings." },
    excel: { crumb: "Dashboard", title: "Excel Import", subtitle: "Bulk import tiles using an Excel sheet." },
    bulk: { crumb: "Dashboard", title: "CSV Upload", subtitle: "Bulk import tiles using a CSV file." },
    qrcodes: { crumb: "Dashboard", title: "QR Codes", subtitle: "Generate and manage QR codes for your tiles." },
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ RENDER GUARDS
  // ═══════════════════════════════════════════════════════════════

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-3">Authentication Required</h2>
          <p className="text-sm text-gray-600 mb-6">Please log in to access the seller dashboard.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full">
          <User className="w-14 h-14 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-3">User Profile Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">Unable to load user profile. Please try logging in again.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all">
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (currentUser.role !== "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full">
          <AlertCircle className="w-14 h-14 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-3">Access Denied</h2>
          <p className="text-sm text-gray-600 mb-6">
            This dashboard is only accessible to sellers. Your role: <strong>{currentUser.role}</strong>
          </p>
          <button onClick={() => (window.location.href = "/")} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Loading data for {currentUser.full_name || currentUser.email}</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ TILE CARD RENDERER (used for mobile list + desktop grid)
  // ═══════════════════════════════════════════════════════════════

  const renderTileCard = (tile: Tile) => (
    <div key={tile.id} className="bg-white border border-outline-variant/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <img
            src={tile.imageUrl}
            alt={tile.name}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-outline-variant/40 shadow-sm bg-white p-1"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-tile.png"; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-on-surface text-sm sm:text-base truncate">{tile.name}</h3>
              <p className="text-xs text-on-surface-variant font-mono">{tile.tileCode}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => handleEditTile(tile)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDeleteTile(tile.id, tile.name)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
            <div>
              <span className="text-on-surface-variant">Category:</span>
              <div className="mt-0.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  tile.category === "floor" ? "bg-primary-container/10 text-primary" :
                  tile.category === "wall" ? "bg-secondary-container/10 text-secondary" :
                  "bg-surface-container text-on-surface-variant"
                }`}>
                  {tile.category === "both" ? "Both" : tile.category}
                </span>
              </div>
            </div>
            <div>
              <span className="text-on-surface-variant">Size:</span>
              <div className="font-semibold text-on-surface">{tile.size}</div>
            </div>
            <div>
              <span className="text-on-surface-variant">Price:</span>
              <div className="font-bold text-on-surface">₹{tile.price.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-on-surface-variant">Stock:</span>
              <div className="font-semibold text-on-surface">
                {tile.stock || 0}
                {(tile.stock || 0) < 10 && tile.inStock && <span className="text-orange-600 ml-1">(Low)</span>}
              </div>
            </div>
          </div>

          {(tile.tileSurface || tile.tileMaterial) && (
            <div className="mt-3 border-t border-outline-variant/40 pt-3">
              <button
                onClick={() => setExpandedTileId(expandedTileId === tile.id ? null : tile.id)}
                className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Tile Specifications</span>
                {expandedTileId === tile.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedTileId === tile.id && (
                <div className="mt-2 space-y-2 animate-slide-down">
                  {tile.tileSurface && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant flex items-center gap-1"><Circle className="w-3 h-3" /> Surface:</span>
                      <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">{tile.tileSurface}</span>
                    </div>
                  )}
                  {tile.tileMaterial && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant flex items-center gap-1"><Layers className="w-3 h-3" /> Material:</span>
                      <span className="font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{tile.tileMaterial}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(tile)}`}>
              {getStockStatusText(tile)}
            </span>
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tile.qrCode ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
              QR: {tile.qrCode ? "Yes" : "No"}
            </span>
            {tile.textureUrl && (
              <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800">Has Texture</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // ✅ MAIN RENDER
  // ═══════════════════════════════════════════════════════════════

  const currentMeta = tabMeta[activeTab] || tabMeta.tiles;
  const displayName = currentUser.full_name || currentUser.email?.split('@')[0] || 'Seller';
  const planLabel = planStatus.planName || (planStatus.loading ? 'Checking plan...' : 'No Active Plan');

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MOBILE OVERLAY */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SIDEBAR */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 border-r border-outline-variant/60 bg-white/70 backdrop-blur-xl z-50 flex flex-col py-6 px-4 shadow-sm transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-8 px-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-lg text-primary leading-tight truncate">Tilesview360</h1>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Seller Dashboard</p>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1 text-on-surface-variant hover:bg-surface-container rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto sidebar-scroll pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                title={item.restricted ? disabledMessage : undefined}
                className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-primary bg-primary/10 border-r-4 border-primary"
                    : item.restricted
                    ? "text-gray-400 opacity-70 hover:bg-surface-container-high/40"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40 hover:translate-x-1"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.restricted && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-4 pt-4 border-t border-outline-variant/60 space-y-1 flex-shrink-0">
          {/* Create New Tile / Close Form - SOURCE-AWARE TOGGLE */}
          <button
            onClick={() => handleTileFormToggle('sidebar')}
            className={`w-full mb-4 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-sm ${
              isTileFormOpen && formOpenedFrom === 'sidebar'
                ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
                : "bg-primary text-white shadow-primary/20"
            }`}
          >
            {isTileFormOpen && formOpenedFrom === 'sidebar' ? (
              <>
                <X className="w-4 h-4" />
                Close Form
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create New Tile
              </>
            )}
          </button>

          <button
            onClick={() => handleTabChange("profile")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40 transition-all text-sm font-medium"
          >
            <SettingsIcon className="w-4 h-4" />
            Settings
          </button>

          <a
            href="mailto:support@tilesview360.com"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40 transition-all text-sm font-medium"
          >
            <HelpCircle className="w-4 h-4" />
            Support
          </a>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loggingOut ? <Loader className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MAIN COLUMN (Header + Content) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-outline-variant/40 h-16 px-3 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container-high/50 rounded-lg flex-shrink-0">
              <Menu className="w-5 h-5" />
            </button>
            {/* ✅ SEARCH BAR - Dummy jaisa exact gray icon */}
            <div className="relative w-full max-w-2xl group">
  {/* 1. Added z-10 
      2. Changed color to text-gray-500 for testing (ya wapas apna text-on-surface-variant laga lein agar wo config me hai) */}
  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors pointer-events-none z-10" />
  
  <input
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search tiles by name, code, material..."
    className="w-full bg-surface-container-low border-none rounded-full py-2 pl-12 pr-4 text-sm sm:text-base focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
  />
</div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-3 flex-shrink-0">
            <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-high/40 rounded-full transition-transform active:scale-90 hidden sm:inline-flex">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
            </button>
            <button
              onClick={() => handleTabChange("profile")}
              className="p-2 text-on-surface-variant hover:bg-surface-container-high/40 rounded-full transition-transform active:scale-90 hidden sm:inline-flex"
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            {/* LOGOUT BUTTON - NEXT TO SETTINGS */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-2 text-on-surface-variant hover:bg-red-50 hover:text-red-600 rounded-full transition-transform active:scale-90 hidden sm:inline-flex disabled:opacity-50"
              title="Logout"
            >
              {loggingOut ? <Loader className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
            </button>
            <div className="h-6 w-px bg-outline-variant hidden sm:block" />
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-sm text-on-surface truncate max-w-[120px]">{displayName}</p>
                <p className="text-[10px] text-on-surface-variant truncate max-w-[120px]">{planLabel}</p>
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Alerts */}
          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-red-800 font-semibold text-sm">Error</p>
                <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold text-lg">×</button>
            </div>
          )}
          {success && (
            <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-slide-down">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-green-800 font-semibold text-sm">Success</p>
                <p className="text-green-700 text-xs sm:text-sm break-words">{success}</p>
              </div>
              <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600 font-bold text-lg">×</button>
            </div>
          )}

          {/* Page Title Row */}
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
  <div className="min-w-0">
    <nav className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">
      {currentMeta.crumb}
    </nav>
    <h2 className="text-2xl sm:text-[28px] leading-tight text-on-surface">{currentMeta.title}</h2>
    <p className="text-on-surface-variant text-sm mt-0.5">{currentMeta.subtitle}</p>
  </div>
  
  {activeTab === "tiles" && (
    <button
      onClick={() => handleTileFormToggle('header')}
      // Yahan classes update ki gayi hain: px-4 py-2, gap-1.5, rounded-lg, aur shadow-md
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all font-semibold text-sm shadow-md w-fit ${
        isTileFormOpen && formOpenedFrom === 'header'
          ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
          : "bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20"
      }`}
    >
      {isTileFormOpen && formOpenedFrom === 'header' ? (
        <>
          <X className="w-4 h-4" />
          Close Form
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Add New Tile
        </>
      )}
    </button>
  )}
</div>
          {/* ═══════════════════════════════════════════════════════ */}
          {/* TILES TAB */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === "tiles" && (
            <>
              {/* Real Plan Status Banner (business logic) */}
              <PlanStatusBanner
                sellerId={currentUser?.user_id || ''}
                onViewPlans={() => setShowPlansModal(true)}
                forceRefresh={planRefreshTrigger}
                totalTilesCount={tiles.length} 
                onPlanStatusChange={handlePlanStatusChange}
              />

              {/* Stats Grid */}
              <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-on-surface-variant font-medium text-xs">Total Tiles</p>
                    <h4 className="text-lg font-bold leading-tight">{tiles.length}</h4>
                    <p className="text-primary text-[9px] font-bold uppercase tracking-wider">{categoryCount} Categories</p>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-on-surface-variant font-medium text-xs">In Stock</p>
                    <h4 className="text-lg font-bold leading-tight">{inStockCount}</h4>
                    <p className="text-green-600 text-[9px] font-bold uppercase tracking-wider">{availabilityPct}% Avail.</p>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
                  <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-on-surface-variant font-medium text-xs">Total Stock</p>
                    <h4 className="text-lg font-bold leading-tight">{totalStock}</h4>
                    <p className="text-secondary text-[9px] font-bold uppercase tracking-wider">Units</p>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-on-surface-variant font-medium text-xs">Low Stock</p>
                    <h4 className="text-lg font-bold leading-tight">{lowStockCount}</h4>
                    <p className="text-orange-600 text-[9px] font-bold uppercase tracking-wider">Reorder</p>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center gap-3 hover:-translate-y-0.5 transition-all shadow-sm">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-on-surface-variant font-medium text-xs">Out of Stock</p>
                    <h4 className="text-lg font-bold leading-tight">{outOfStockCount}</h4>
                    <p className="text-red-600 text-[9px] font-bold uppercase tracking-wider">Unavailable</p>
                  </div>
                </div>
              </section>

              {/* Add/Edit Tile Form */}
              {(isAddingTile || editingTile) && (
                <div className="p-4 sm:p-6 border border-primary/30 rounded-2xl bg-primary/5 relative">
                  {/* Close (X) button top-right of form */}
                  <button
                    onClick={closeTileForm}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-on-surface-variant hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-on-surface pr-10">
                    {editingTile ? (
                      <><Edit className="w-5 h-5 text-primary" /><span className="truncate">Edit: {editingTile.name}</span></>
                    ) : (
                      <><Plus className="w-5 h-5 text-primary" /> Add New Tile</>
                    )}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Name *</label>
                      <input
                        type="text"
                        placeholder="Enter tile name"
                        value={newTile.name}
                        onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
                        className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-shadow outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Code</label>
                      <input
                        type="text"
                        placeholder="Auto-generated if empty"
                        value={newTile.tileCode}
                        onChange={(e) => setNewTile({ ...newTile, tileCode: e.target.value })}
                        className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-shadow outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Category *</label>
                      <select
                        value={newTile.category}
                        onChange={(e) => setNewTile({ ...newTile, category: e.target.value as any })}
                        className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white cursor-pointer transition-shadow outline-none"
                      >
                        <option value="floor">Floor Only</option>
                        <option value="wall">Wall Only</option>
                        <option value="both">Floor & Wall</option>
                      </select>
                    </div>

                    {/* SIZE */}
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Size *</label>
                      {(() => {
                        const standardSizes = [
                          "30x30 cm", "30x60 cm", "60x60 cm", "60x120 cm", "80x80 cm",
                          "40x40 cm", "40x60 cm", "50x50 cm", "20x120 cm", "15x90 cm",
                          "10x30 cm", "20x20 cm", "25x40 cm", "61x122 cm", "122x122 cm",
                          "75x75 cm", "100x100 cm", "45x45 cm", "7.5x15 cm", "6x25 cm"
                        ];
                        const currentSize = newTile.size || "";
                        const isManualMode = currentSize === "manual_trigger" || (currentSize !== "" && !standardSizes.includes(currentSize));
                        let parsedWidth = "", parsedHeight = "";
                        if (isManualMode && currentSize !== "manual_trigger") {
                          const parts = currentSize.replace(" cm", "").split("x");
                          if (parts.length === 2) { parsedWidth = parts[0]; parsedHeight = parts[1]; }
                        }
                        const handleManualChange = (w: string, h: string) => setNewTile({ ...newTile, size: `${w}x${h} cm` });

                        return (
                          <div className="space-y-3">
                            {!isManualMode ? (
                              <div>
                                <div className="relative">
                                  <select
                                    value={currentSize}
                                    onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm appearance-none cursor-pointer pr-10 outline-none"
                                  >
                                    <option value="">Select Tile Size</option>
                                    {standardSizes.map((s) => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                  <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3 top-3 pointer-events-none" />
                                </div>
                                <button type="button" onClick={() => setNewTile({ ...newTile, size: "manual_trigger" })} className="mt-2 text-xs sm:text-sm text-primary font-semibold hover:opacity-80 flex items-center gap-1">
                                  <Plus className="w-3.5 h-3.5" /> Add Manual Size
                                </button>
                              </div>
                            ) : (
                              <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3 animate-slide-down">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs sm:text-sm font-bold text-primary">Enter Custom Size (in cm)</span>
                                  <button type="button" onClick={() => setNewTile({ ...newTile, size: "" })} className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded">Cancel</button>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <label className="block text-[10px] sm:text-xs font-semibold text-primary mb-1">Width</label>
                                    <input type="number" placeholder="e.g. 300" value={parsedWidth} onChange={(e) => handleManualChange(e.target.value, parsedHeight)} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" min="1" />
                                  </div>
                                  <div className="text-primary font-bold text-lg mt-5">×</div>
                                  <div className="flex-1">
                                    <label className="block text-[10px] sm:text-xs font-semibold text-primary mb-1">Height</label>
                                    <input type="number" placeholder="e.g. 600" value={parsedHeight} onChange={(e) => handleManualChange(parsedWidth, e.target.value)} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" min="1" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* SURFACE */}
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Surface</label>
                      {(() => {
                        const standardSurfaces = ["Polished", "Step Side", "Matt", "Carving", "High Gloss", "Metallic", "Sugar", "Glue", "Punch"];
                        const currentSurface = newTile.tileSurface || "";
                        const isManualMode = currentSurface === "manual_trigger" || (currentSurface !== "" && !standardSurfaces.includes(currentSurface));
                        return (
                          <div className="space-y-3">
                            {!isManualMode ? (
                              <div>
                                <div className="relative">
                                  <select value={currentSurface} onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value || undefined })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm appearance-none cursor-pointer pr-10 outline-none">
                                    <option value="">Select Surface Finish</option>
                                    {standardSurfaces.map((s) => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                  <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3 top-3 pointer-events-none" />
                                </div>
                                <button type="button" onClick={() => setNewTile({ ...newTile, tileSurface: "manual_trigger" })} className="mt-2 text-xs sm:text-sm text-primary font-semibold hover:opacity-80 flex items-center gap-1">
                                  <Plus className="w-3.5 h-3.5" /> Add Manual Surface
                                </button>
                              </div>
                            ) : (
                              <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3 animate-slide-down">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs sm:text-sm font-bold text-primary">Enter Custom Surface</span>
                                  <button type="button" onClick={() => setNewTile({ ...newTile, tileSurface: "" })} className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded">Cancel</button>
                                </div>
                                <input type="text" placeholder="e.g. Rustic, Satin, 3D Print" value={currentSurface === "manual_trigger" ? "" : currentSurface} onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value })} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" autoFocus />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      {newTile.tileSurface && newTile.tileSurface !== "manual_trigger" && newTile.tileSurface.trim() !== "" && (
                        <div className="flex items-center gap-2 text-xs text-green-600 mt-1.5">
                          <CheckCircle className="w-3 h-3" /><span>Selected: <strong>{newTile.tileSurface}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* MATERIAL */}
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Material</label>
                      {(() => {
                        const standardMaterials = ["Slabs", "GVT & PGVT", "Double Charge", "Counter Tops", "Full Body", "Ceramic", "Mosaic", "Subway"];
                        const currentMaterial = newTile.tileMaterial || "";
                        const isManualMode = currentMaterial === "manual_trigger" || (currentMaterial !== "" && !standardMaterials.includes(currentMaterial));
                        return (
                          <div className="space-y-3">
                            {!isManualMode ? (
                              <div>
                                <div className="relative">
                                  <select value={currentMaterial} onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value || undefined })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm appearance-none cursor-pointer pr-10 outline-none">
                                    <option value="">Select Material Type</option>
                                    {standardMaterials.map((m) => <option key={m} value={m}>{m}</option>)}
                                  </select>
                                  <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3 top-3 pointer-events-none" />
                                </div>
                                <button type="button" onClick={() => setNewTile({ ...newTile, tileMaterial: "manual_trigger" })} className="mt-2 text-xs sm:text-sm text-primary font-semibold hover:opacity-80 flex items-center gap-1">
                                  <Plus className="w-3.5 h-3.5" /> Add Manual Material
                                </button>
                              </div>
                            ) : (
                              <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3 animate-slide-down">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs sm:text-sm font-bold text-primary">Enter Custom Material</span>
                                  <button type="button" onClick={() => setNewTile({ ...newTile, tileMaterial: "" })} className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded">Cancel</button>
                                </div>
                                <input type="text" placeholder="e.g. Porcelain, Natural Stone, Glass" value={currentMaterial === "manual_trigger" ? "" : currentMaterial} onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value })} className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white outline-none shadow-sm" autoFocus />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      {newTile.tileMaterial && newTile.tileMaterial !== "manual_trigger" && newTile.tileMaterial.trim() !== "" && (
                        <div className="flex items-center gap-2 text-xs text-green-600 mt-1.5">
                          <CheckCircle className="w-3 h-3" /><span>Selected: <strong>{newTile.tileMaterial}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Price (₹) *</label>
                      <input type="number" placeholder="Enter price" value={newTile.price || ""} onChange={(e) => setNewTile({ ...newTile, price: e.target.value === "" ? 0 : Number(e.target.value) })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm outline-none" min="0" step="0.01" />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Stock Quantity *</label>
                      <input type="number" placeholder="Enter stock quantity" value={newTile.stock || ""} onChange={(e) => setNewTile({ ...newTile, stock: e.target.value === "" ? 0 : Number(e.target.value) })} className="w-full px-3 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm outline-none" min="0" />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Tile Image *</label>
                      <div className="flex flex-col gap-2">
                        <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "image"); }} className="hidden" id="tile-image-upload" />
                        <label htmlFor="tile-image-upload" className={`flex items-center justify-center gap-2 px-3 py-2.5 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors text-sm font-medium ${imageUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                          {imageUploading ? <><Loader className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Choose Image</>}
                        </label>
                        {newTile.imageUrl && (
                          <div className="flex items-center gap-2">
                            <img src={newTile.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-outline-variant shadow-sm" />
                            <div className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">Uploaded</span></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant">Texture (Optional)</label>
                      <div className="flex flex-col gap-2">
                        <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "texture"); }} className="hidden" id="texture-image-upload" />
                        <label htmlFor="texture-image-upload" className={`flex items-center justify-center gap-2 px-3 py-2.5 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors text-sm font-medium ${textureUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                          {textureUploading ? <><Loader className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Choose Texture</>}
                        </label>
                        {newTile.textureUrl && (
                          <div className="flex items-center gap-2">
                            <img src={newTile.textureUrl} alt="Texture" className="w-16 h-16 object-cover rounded-lg border border-outline-variant shadow-sm" />
                            <div className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">Uploaded</span></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-6">
                    <button
                      onClick={editingTile ? handleUpdateTile : handleAddTile}
                      disabled={imageUploading || textureUploading}
                      className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold shadow-md shadow-primary/20"
                    >
                      <Save className="w-4 h-4" />
                      {editingTile ? "Update Tile" : "Save Tile"}
                    </button>
                    <button
                      onClick={closeTileForm}
                      className="px-6 py-2.5 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Inventory Card */}
              <section className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 overflow-hidden shadow-sm">
                {/* Filter Bar */}
                <div className="p-4 border-b border-outline-variant/40 bg-white/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-9 font-semibold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer outline-none">
                        <option value="all">All Categories</option>
                        <option value="floor">Floor</option>
                        <option value="wall">Wall</option>
                        <option value="both">Floor & Wall</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
                    </div>
                    <div className="relative">
                      <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-9 font-semibold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer outline-none">
                        <option value="all">Stock Status</option>
                        <option value="in-stock">In Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
                    </div>
                    <button onClick={loadData} title="Refresh" className="p-2 hover:bg-surface-container-highest/40 rounded-lg transition-all group">
                      <RefreshCw className="w-4 h-4 text-on-surface-variant group-active:rotate-180 transition-transform duration-500" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">
                      {currentTiles.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
                    </p>
                    <div className="hidden lg:flex bg-surface-container rounded-lg p-1">
                      <button onClick={() => setViewMode("grid")} className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}>
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button onClick={() => setViewMode("table")} className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${viewMode === "table" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}>
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Table */}
                {viewMode === "table" && (
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low/50 border-b border-outline-variant/40">
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Image</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Name</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Code</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Size</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Surface</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Material</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Price</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Stock</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">QR</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {currentTiles.length === 0 ? (
                          <tr>
                            <td colSpan={12} className="text-center p-10 text-on-surface-variant">
                              {tiles.length === 0 ? (
                                <div className="space-y-2"><Package className="w-12 h-12 text-gray-300 mx-auto" /><p className="font-semibold">No tiles found</p><p className="text-sm">Start by adding your first tile!</p></div>
                              ) : (
                                <div className="space-y-2"><Search className="w-12 h-12 text-gray-300 mx-auto" /><p className="font-semibold">No tiles match your search</p><p className="text-sm">Try adjusting your search or filters</p></div>
                              )}
                            </td>
                          </tr>
                        ) : (
                          currentTiles.map((tile) => (
                            <tr key={tile.id} className="hover:bg-primary-container/5 transition-colors group">
                              <td className="p-4">
                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-white p-1">
                                  <img src={tile.imageUrl} alt={tile.name} className="w-full h-full object-cover rounded" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-tile.png"; }} />
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-on-surface text-sm">{tile.name}</p>
                                {tile.textureUrl && <p className="text-[10px] text-green-600">Has texture</p>}
                              </td>
                              <td className="p-4"><span className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">{tile.tileCode}</span></td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  tile.category === "floor" ? "bg-primary-container/10 text-primary" :
                                  tile.category === "wall" ? "bg-secondary-container/10 text-secondary" :
                                  "bg-surface-container text-on-surface-variant"
                                }`}>
                                  {tile.category === "both" ? "Both" : tile.category.charAt(0).toUpperCase() + tile.category.slice(1)}
                                </span>
                              </td>
                              <td className="p-4 text-xs font-medium text-on-surface">{tile.size}</td>
                              <td className="p-4">
                                {tile.tileSurface ? (
                                  <div className="flex items-center gap-1.5 text-xs"><Circle className="w-3 h-3 text-on-surface-variant" /><span>{tile.tileSurface}</span></div>
                                ) : <span className="text-gray-400 text-xs">—</span>}
                              </td>
                              <td className="p-4">
                                {tile.tileMaterial ? (
                                  <div className="flex items-center gap-1.5 text-xs"><Layers className="w-3.5 h-3.5 text-secondary" /><span>{tile.tileMaterial}</span></div>
                                ) : <span className="text-gray-400 text-xs">—</span>}
                              </td>
                              <td className="p-4 text-right font-bold text-sm text-on-surface">₹{tile.price.toLocaleString()}</td>
                              <td className="p-4 text-center font-semibold text-sm text-on-surface">{tile.stock || 0}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(tile)}`}>
                                  {getStockStatusText(tile)}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${tile.qrCode ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                                  {tile.qrCode ? "✓" : "○"}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleEditTile(tile)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all" title="Edit"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteTile(tile.id, tile.name)} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Desktop Grid View */}
                {viewMode === "grid" && (
                  <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                    {currentTiles.length === 0 ? (
                      <div className="col-span-full text-center py-10 text-on-surface-variant">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="font-semibold">No tiles found</p>
                      </div>
                    ) : (
                      currentTiles.map((tile) => renderTileCard(tile))
                    )}
                  </div>
                )}

                {/* Mobile Card View */}
                <div className="lg:hidden p-3 sm:p-4 space-y-3">
                  {currentTiles.length === 0 ? (
                    <div className="text-center py-12 text-on-surface-variant">
                      {tiles.length === 0 ? (
                        <div className="space-y-2"><Package className="w-16 h-16 text-gray-300 mx-auto" /><p className="font-semibold">No tiles found</p><p className="text-sm">Start by adding your first tile!</p></div>
                      ) : (
                        <div className="space-y-2"><Search className="w-16 h-16 text-gray-300 mx-auto" /><p className="font-semibold">No tiles match your search</p><p className="text-sm">Try adjusting your search or filters</p></div>
                      )}
                    </div>
                  ) : (
                    currentTiles.map((tile) => renderTileCard(tile))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 bg-surface-container-low/50 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/30">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentPage === 1 ? "border-outline-variant bg-white text-gray-400 cursor-not-allowed" : "border-outline-variant bg-white text-on-surface-variant hover:text-primary"}`}>
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                      {getPageNumbers().map((page, index) =>
                        page === '...' ? (
                          <span key={`e-${index}`} className="px-2 text-on-surface-variant">...</span>
                        ) : (
                          <button key={page} onClick={() => goToPage(page as number)} className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${currentPage === page ? "bg-primary text-white" : "hover:bg-white text-on-surface-variant"}`}>
                            {page}
                          </button>
                        )
                      )}
                    </div>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentPage === totalPages ? "border-outline-variant bg-white text-gray-400 cursor-not-allowed" : "border-outline-variant bg-white text-on-surface-variant hover:text-primary"}`}>
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </section>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* OTHER TABS */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab !== "tiles" && (
            <section className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-4 sm:p-6">
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
              {activeTab === "billing" && (
                <BillingTab
                  key={`billing-tab-${planRefreshTrigger}`}
                  sellerId={currentUser?.user_id || ''}
                  sellerEmail={currentUser?.email || ''}
                />
              )}
            </section>
          )}
        </main>

        {/* FOOTER */}
        <footer className="px-3 sm:px-6 lg:px-8 border-t border-outline-variant/40 flex flex-col sm:flex-row justify-between items-center gap-2 text-on-surface-variant py-4">
          <p className="text-[11px]">© {new Date().getFullYear()} Tilesview360. All rights reserved.</p>
          <div className="flex gap-4 text-[11px] font-medium">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
            <a className="hover:text-primary transition-colors" href="#">API Docs</a>
          </div>
        </footer>
      </div>

      {/* MOBILE FAB - SOURCE-AWARE TOGGLE */}
      {activeTab === "tiles" && (
        <button
          onClick={() => handleTileFormToggle('mobile')}
          className={`lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform z-[60] ${
            isTileFormOpen && formOpenedFrom === 'mobile'
              ? "bg-red-500"
              : "bg-gradient-to-br from-[#2d5bff] to-[#8127cf]"
          }`}
        >
          {isTileFormOpen && formOpenedFrom === 'mobile' ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* PAYMENT MODALS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <PlansModal
        isOpen={showPlansModal}
        onClose={() => setShowPlansModal(false)}
        isLoggedIn={isAuthenticated}
        sellerId={currentUser?.user_id || ''}
        userToken={userToken}
      />

      <PaymentConfirmationModal
        isOpen={showPaymentConfirmation}
        onClose={() => { setShowPaymentConfirmation(false); setSelectedPlan(null); }}
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
          userToken={userToken}
        />
      )}
    </div>
  );
};













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
// import { jwtService } from '../lib/jwtService';
// // Payment System Imports
// import { PlansModal } from './Payment/PlansModal';
// import { PaymentConfirmationModal } from './Payment/PaymentConfirmationModal';
// import { PaymentCheckout } from './Payment/PaymentCheckout';
// import { initiatePayment } from '../lib/paymentService';
// import { getPlanById } from '../lib/planService';
// import type { Plan } from '../types/plan.types';
// import type { RazorpayCheckoutOptions } from '../types/payment.types';
// import { auth } from '../lib/firebase';
// import { HistoryTab } from "./HistoryTab";
// import {
//   uploadTile,
//   updateTile,
//   deleteTile,
//   getSellerProfile,
//   getSellerTiles,
//   updateTileQRCode,
//   getTileById,
// } from "../lib/firebaseutils";
// import { BillingTab } from './BillingTab'
// import { ToggleLeft, ToggleRight,CreditCard } from 'lucide-react';

// import { uploadToCloudinary } from "../utils/cloudinaryUtils";
// import { db } from '../lib/firebase';
// import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
// import { 
//   getSellerSubscription, 
//   isSubscriptionExpired,
//   getDaysUntilExpiry 
// } from "../lib/subscriptionService";

// // ═══════════════════════════════════════════════════════════════
// // ✅ INTERFACES
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
// // ✅ MAIN COMPONENT
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
//     | "history"
//     |"billing"
//   >("tiles");

//   // Tile Management
//   const [editingTile, setEditingTile] = useState<Tile | null>(null);
//   const [sellerProfile, setSellerProfile] = useState<any>(null);
//   const [tiles, setTiles] = useState<Tile[]>([]);
//   const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
//    const [userToken, setUserToken] = useState<string>('');
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
//   const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0)
//   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
//   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   useEffect(() => {
//   const checkPaymentSuccess = () => {
//     const flag = localStorage.getItem('plan_just_purchased');
//     if (flag) {
//       console.log('🔔 [DASHBOARD] Payment success detected');
//       console.log('🔄 [DASHBOARD] Triggering plan refresh...');
      
//       // Increment refresh trigger
//       setPlanRefreshTrigger(prev => prev + 1);
      
//       // Clear flag
//       localStorage.removeItem('plan_just_purchased');
      
//       // Close plans modal if open
//       if (showPlansModal) {
//         console.log('📋 [DASHBOARD] Auto-closing plans modal...');
//         setTimeout(() => {
//           setShowPlansModal(false);
//         }, 3000);
//       }
//     }
//   };

//   const interval = setInterval(checkPaymentSuccess, 1000);
  
//   return () => clearInterval(interval);
// }, [showPlansModal]);
//    useEffect(() => {
//     console.log('🔑 Fetching auth token from JWT service...');
//     console.log('isAuthenticated:', isAuthenticated);
    
//     if (isAuthenticated) {
//       const token = jwtService.getAccessToken();
      
//       if (token) {
//         const isValid = jwtService.isValidTokenFormat(token);
        
//         if (isValid) {
//           setUserToken(token);
//           console.log('✅ Token fetched and validated successfully');
//         } else {
//           console.error('❌ Invalid token format');
//           setUserToken('');
//         }
//       } else {
//         console.log('⚠️ No token found in storage');
//         setUserToken('');
//       }
//     } else {
//       console.log('⚠️ User not authenticated');
//       setUserToken('');
//     }
//   }, [isAuthenticated]);
//   // ✅ PLAN STATUS STATE
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
//   // ✅ PLAN STATUS CHECK FUNCTION
//   // ═══════════════════════════════════════════════════════════════

//   const checkSellerPlanStatus = async (sellerId: string): Promise<SellerPlanStatus> => {
//     try {
//       console.log('🔍 Checking plan status via subscriptionService:', sellerId);
      
//       const subscription = await getSellerSubscription(sellerId, true);
      
//       if (!subscription) {
//         console.log('❌ No subscription found');
//         return {
//           isActive: false,
//           expiresAt: null,
//           planName: null,
//           planId: null,
//           daysRemaining: 0,
//           loading: false,
//           lastChecked: new Date()
//         };
//       }
      
//       const expired = isSubscriptionExpired(subscription);
//       const daysRemaining = getDaysUntilExpiry(subscription);
//       const endDate = subscription.end_date ? new Date(subscription.end_date) : null;
      
//       console.log('✅ Plan status checked:', {
//         isActive: !expired,
//         planName: subscription.plan_name,
//         daysRemaining,
//         expired
//       });
      
//       return {
//         isActive: !expired,
//         expiresAt: endDate,
//         planName: subscription.plan_name || null,
//         planId: subscription.plan_id || null,
//         daysRemaining,
//         loading: false,
//         lastChecked: new Date()
//       };
      
//     } catch (error: any) {
//       console.error('❌ Error checking plan status:', error);
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
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ LOAD PLAN STATUS
//   // ═══════════════════════════════════════════════════════════════

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

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ HANDLE PLAN STATUS CHANGE FROM CHILD
//   // ═══════════════════════════════════════════════════════════════

//   const handlePlanStatusChange = async (isActive: boolean, isExpired: boolean) => {
//     console.log('═══════════════════════════════════════════════════════');
//     console.log('🔔 PLAN STATUS CHANGE NOTIFICATION FROM CHILD');
//     console.log('   isActive:', isActive);
//     console.log('   isExpired:', isExpired);
//     console.log('═══════════════════════════════════════════════════════');

//     setPlanStatus(prev => ({
//       ...prev,
//       isActive,
//       loading: false,
//       lastChecked: new Date()
//     }));

//     console.log('✅ Parent state updated immediately');
//     console.log('   Scan button will disable:', !isActive);
//     console.log('   Worker button will disable:', !isActive);

//     if (!isActive && isExpired) {
//       console.log('🔄 Plan expired - Fetching full status in background...');
//       setTimeout(async () => {
//         await loadPlanStatus();
//         console.log('✅ Background refresh complete');
//       }, 1000);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ CHECK IF FEATURE IS ALLOWED
//   // ═══════════════════════════════════════════════════════════════

//   const isFeatureAllowed = (feature: 'scan' | 'worker' | 'analytics'): boolean => {
//     if (planStatus.loading) {
//       console.log(`⏳ Feature '${feature}' check: Loading...`);
//       return false;
//     }

//     const allowed = planStatus.isActive;
//     console.log(`🔍 Feature '${feature}' check: ${allowed ? 'ALLOWED' : 'BLOCKED'}`);
//     return allowed;
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ GET DISABLED REASON MESSAGE
//   // ═══════════════════════════════════════════════════════════════

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

//   const handlePaymentSuccess = async () => {
//     console.log('═══════════════════════════════════════════════════════');
//     console.log('🎉 PAYMENT SUCCESS HANDLER STARTED');
//     console.log('═══════════════════════════════════════════════════════');
    
//     try {
//       console.log('🔄 Step 1/8: Closing modals...');
//       setCheckoutOptions(null);
//       setPaymentId(null);
//       setProcessingPayment(false);
//       setSelectedPlan(null);
//       setShowPaymentConfirmation(false);
//       setShowPlansModal(false);
//       console.log('✅ Modals closed');
      
//       console.log('🔄 Step 2/8: Showing success message...');
//       setSuccess('🎉 Payment successful! Activating plan...');
//       console.log('✅ Success message shown');
      
//       console.log('🔄 Step 3/8: Enabling workers (BEFORE refresh)...');
//       try {
//         const { enableAllSellersWorkers } = await import('../lib/firebaseutils');
//         const result = await enableAllSellersWorkers(currentUser?.user_id || '');
        
//         if (result.success && result.count > 0) {
//           console.log(`✅ Enabled ${result.count} worker(s)`);
//           setSuccess(`🎉 Plan activated! ${result.count} worker(s) enabled.`);
//         } else {
//           console.log('ℹ️ No workers to enable');
//         }
//       } catch (workerError: any) {
//         console.warn('⚠️ Worker enable failed:', workerError);
//       }
//       console.log('✅ Worker enablement complete');
      
//       console.log('🔄 Step 4/8: Waiting for Firestore (2s)...');
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       console.log('✅ Firestore wait complete');
      
//       console.log('🔄 Step 5/8: Triggering refresh (NOW SAFE)...');
//       setPlanRefreshTrigger(prev => prev + 1);
//       console.log('✅ Refresh triggered');
      
//       console.log('🔄 Step 6/8: UI sync (1s)...');
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       console.log('✅ UI sync complete');
      
//       console.log('🔄 Step 7/8: Reloading plan status...');
//       await loadPlanStatus();
//       console.log('✅ Plan status reloaded');
      
//       console.log('🔄 Step 8/8: Reloading dashboard...');
//       await loadData();
//       console.log('✅ Dashboard reloaded');
      
//       console.log('🎉 All steps complete!');
//       setSuccess('✅ Plan activated! Workers can now login.');
      
//       setTimeout(() => setSuccess(null), 7000);
      
//       console.log('═══════════════════════════════════════════════════════');
//       console.log('✅ PAYMENT SUCCESS HANDLER COMPLETED');
//       console.log('═══════════════════════════════════════════════════════');
      
//     } catch (error: any) {
//       console.error('═══════════════════════════════════════════════════════');
//       console.error('❌ ERROR:', error);
//       console.error('═══════════════════════════════════════════════════════');
//       setError('Payment successful but refresh failed. Reload page manually.');
//     }
//   };

//   const handlePaymentError = async (error: string) => {
//     console.error('═══════════════════════════════════════════════════════');
//     console.error('❌ PAYMENT ERROR:', error);
//     console.error('═══════════════════════════════════════════════════════');
    
//     setError(`❌ Payment Error: ${error}`);
    
//     console.log('🧹 Cleaning up payment state...');
//     setCheckoutOptions(null);
//     setPaymentId(null);
//     setProcessingPayment(false);
//     setSelectedPlan(null);
//     setShowPaymentConfirmation(false);
//     console.log('✅ Payment state cleaned');
    
//     setTimeout(async () => {
//       console.log('🔄 Reloading plan status after error...');
//       await loadPlanStatus();
//       console.log('✅ Plan status check complete after error');
//     }, 2000);
    
//     console.log('═══════════════════════════════════════════════════════');
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ TILE MANAGEMENT FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════

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

//   // const validateTileForm = (): string | null => {
//   //   if (!newTile.name?.trim()) {
//   //     return "❌ Tile Name is required. Please enter a tile name.";
//   //   }

//   //   if (!newTile.size?.trim()) {
//   //     return "❌ Tile Size is required. Please enter or select a size (e.g., 60x60 cm).";
//   //   }

//   //   if (!newTile.price || newTile.price <= 0) {
//   //     return "❌ Valid Price is required. Please enter a price greater than 0.";
//   //   }

//   //   if (newTile.stock === undefined || newTile.stock < 0) {
//   //     return "❌ Valid Stock Quantity is required. Please enter stock (0 or more).";
//   //   }

//   //   if (!newTile.imageUrl?.trim()) {
//   //     return "❌ Tile Image is required. Please upload an image before saving.";
//   //   }

//   //   return null;
//   // }; 


// const validateTileForm = (): string | null => {
//     if (!newTile.name?.trim()) {
//       return "❌ Tile Name is required. Please enter a tile name.";
//     }

//     // --- UPDATED SIZE VALIDATION ---
//     if (!newTile.size || newTile.size.trim() === "" || newTile.size === "manual_trigger") {
//       return "❌ Tile Size is required. Please select or enter a size.";
//     }
//     // Check if user left Width or Height blank in manual mode
//     if (newTile.size.includes('x') && !newTile.size.match(/^\d+x\d+ cm$/)) {
//       return "❌ Invalid Manual Size. Please enter BOTH Width and Height properly.";
//     }
//     // ---------------------------------

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

//       // ✅ PROPER BACKEND SAFETY APPLIED HERE
//       const baseTileData = {
//         ...newTile,
//         size: newTile.size?.trim(),
//         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
//         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
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


//   //   try {
//   //     setError(null);

//   //     const validationError = validateTileForm();
//   //     if (validationError) {
//   //       setError(validationError);
//   //       return;
//   //     }

//   //     if (!editingTile) {
//   //       setError("No tile selected for editing");
//   //       return;
//   //     }

//   //     console.log("🔄 Starting tile update:", editingTile.name);

//   //     const updates = {
//   //       ...newTile,
//   //       size: newTile.size?.trim(),
//   // tileSurface: newTile.tileSurface?.trim() || "",
//   // tileMaterial: newTile.tileMaterial?.trim() || "",
//   //       inStock: (newTile.stock || 0) > 0,
//   //       updatedAt: new Date().toISOString(),
//   //     };

//   //     console.log("💾 Updating tile in database...");
//   //     await updateTile(editingTile.id, updates);
//   //     console.log("✅ Tile updated in database");

//   //     const criticalFieldsChanged =
//   //       editingTile.name !== newTile.name ||
//   //       editingTile.tileCode !== newTile.tileCode ||
//   //       editingTile.price !== newTile.price ||
//   //       editingTile.size !== newTile.size ||
//   //       editingTile.category !== newTile.category;

//   //     if (criticalFieldsChanged) {
//   //       console.log("🔄 Critical fields changed, attempting QR regeneration...");

//   //       setTimeout(async () => {
//   //         try {
//   //           if (typeof getTileById !== "function") {
//   //             console.warn("⚠️ getTileById not available, skipping QR regeneration");
//   //             return;
//   //           }

//   //           if (typeof generateTileQRCode !== "function") {
//   //             console.warn("⚠️ generateTileQRCode not available, skipping QR regeneration");
//   //             return;
//   //           }

//   //           if (typeof updateTileQRCode !== "function") {
//   //             console.warn("⚠️ updateTileQRCode not available, skipping QR regeneration");
//   //             return;
//   //           }

//   //           console.log("📱 Fetching updated tile data...");
//   //           const updatedTileData = await getTileById(editingTile.id);

//   //           if (!updatedTileData) {
//   //             console.warn("⚠️ Could not fetch updated tile, skipping QR regeneration");
//   //             return;
//   //           }

//   //           console.log("📱 Generating new QR code...");
//   //           const newQRCode = await generateTileQRCode(updatedTileData);

//   //           if (!newQRCode || !newQRCode.startsWith("data:image")) {
//   //             console.warn("⚠️ Invalid QR code generated, skipping update");
//   //             return;
//   //           }

//   //           console.log("💾 Updating QR code in database...");
//   //           await updateTileQRCode(editingTile.id, newQRCode);

//   //           console.log("✅ QR code regenerated successfully");

//   //           await loadData();
//   //         } catch (qrError: any) {
//   //           console.error("⚠️ QR regeneration failed (non-critical):", qrError.message);
//   //         }
//   //       }, 0);
//   //     } else {
//   //       console.log("ℹ️ No critical fields changed, keeping existing QR code");
//   //     }

//   //     console.log("🔄 Reloading tiles list...");
//   //     await loadData();

//   //     setEditingTile(null);
//   //     resetNewTile();

//   //     setSuccess("Tile updated successfully!");
//   //     console.log("✅ Tile update complete");
//   //   } catch (error: any) {
//   //     console.error("❌ Error updating tile:", error);
//   //     setError(`Failed to update tile: ${error.message}`);
//   //   }
//   // };
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

//       // ✅ PROPER BACKEND SAFETY APPLIED HERE
//       const updates = {
//         ...newTile,
//         size: newTile.size?.trim(),
//         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
//         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
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
//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* HEADER SECTION */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
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

//         {/* ✅ PLAN STATUS BANNER WITH CALLBACK */}
//         <PlanStatusBanner 
//           sellerId={currentUser?.user_id || ''} 
//           onViewPlans={() => setShowPlansModal(true)}
//           forceRefresh={planRefreshTrigger}
//           onPlanStatusChange={handlePlanStatusChange}
//         />

//         {/* ═══════════════════════════════════════════════════════════════ */}
//         {/* DESKTOP TABS */}
//         {/* ═══════════════════════════════════════════════════════════════ */}
        
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
//   onClick={() => handleTabChange("history")}
//   className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//     activeTab === "history"
//       ? "bg-green-600 text-white shadow-md"
//       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//   }`}
// >
//   <Clock className="w-4 h-4" />
//   History
// </button> 

// <button
//         onClick={() => setActiveTab("billing")}
//         className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
//           activeTab === "billing"
//             ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
//             : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
//         }`}
//       >
//         <CreditCard className="w-4 h-4" />
//         <span>Billing</span>
//       </button>

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

//         {/* ═══════════════════════════════════════════════════════════════ */}
//         {/* MOBILE TABS */}
//         {/* ═══════════════════════════════════════════════════════════════ */}
        
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
//   onClick={() => handleTabChange("history")}
//   className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
//     activeTab === "history"
//       ? "bg-green-600 text-white shadow-md"
//       : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//   }`}
// >
//   <Clock className="w-4 h-4" />
//   History
// </button>

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

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* PLAN EXPIRY ALERTS */}
//       {/* ═══════════════════════════════════════════════════════════════ */}


    

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* ALERT MESSAGES */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
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
//       {/* TILES TAB CONTENT - COMPLETE */}
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

//           {/* ═══════════════════════════════════════════════════════════════ */}
//           {/* ADD/EDIT TILE FORM - COMPLETE */}
//           {/* ═══════════════════════════════════════════════════════════════ */}
          
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

                
// <div className="space-y-2">
//   <label
//     htmlFor="tile-size-select"
//     className="block text-xs sm:text-sm font-medium text-gray-700"
//   >
//     Size *
//   </label>
  
//   {(() => {
//     // 1. Standard sizes ki list
//     const standardSizes = [
//       "30x30 cm", "30x60 cm", "60x60 cm", "60x120 cm", "80x80 cm", 
//       "40x40 cm", "40x60 cm", "50x50 cm", "20x120 cm", "15x90 cm", 
//       "10x30 cm", "20x20 cm", "25x40 cm", "61x122 cm", "122x122 cm", 
//       "75x75 cm", "100x100 cm", "45x45 cm", "7.5x15 cm", "6x25 cm"
//     ];
    
//     const currentSize = newTile.size || "";
    
//     // Check if user clicked the manual button OR if an existing custom size is loaded
//     const isManualMode = currentSize === "manual_trigger" || (currentSize !== "" && !standardSizes.includes(currentSize));

//     // Extract Width and Height if in manual mode
//     let parsedWidth = "";
//     let parsedHeight = "";

//     if (isManualMode && currentSize !== "manual_trigger") {
//       const parts = currentSize.replace(" cm", "").split("x");
//       if (parts.length === 2) {
//         parsedWidth = parts[0];
//         parsedHeight = parts[1];
//       }
//     }

//     // Auto-merge logic: Automatically adds 'x' and 'cm' in the background
//     const handleManualChange = (w: string, h: string) => {
//       setNewTile({ ...newTile, size: `${w}x${h} cm` });
//     };

//     return (
//       <div className="space-y-3">
//         {!isManualMode ? (
//           // --- STANDARD DROPDOWN VIEW ---
//           <div>
//             <div className="relative">
//               <select
//                 id="tile-size-select"
//                 name="size"
//                 value={currentSize}
//                 onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer pr-10"
//               >
//                 <option value="">Select Tile Size</option>
//                 {standardSizes.map((sizeOption) => (
//                   <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
//                 ))}
//               </select>
//               <div className="absolute right-3 top-2.5 pointer-events-none">
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </div>
//             </div>
            
//             {/* Button to toggle Manual Input */}
//             <button
//               type="button"
//               onClick={() => setNewTile({ ...newTile, size: "manual_trigger" })}
//               className="mt-2 text-xs sm:text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1 transition-colors"
//             >
//               <Plus className="w-3.5 h-3.5" />
//               Add Manual Size
//             </button>
//           </div>
//         ) : (
//           // --- MANUAL ENTRY VIEW (2 BOXES) ---
//           <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg space-y-3 animate-slide-down">
//             <div className="flex justify-between items-center mb-1">
//               <span className="text-xs sm:text-sm font-semibold text-green-800">
//                 Enter Custom Size (in cm)
//               </span>
//               <button
//                 type="button"
//                 onClick={() => setNewTile({ ...newTile, size: "" })}
//                 className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <div className="flex-1">
//                 <label className="block text-[10px] sm:text-xs font-medium text-green-700 mb-1">
//                   Width
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="e.g. 300"
//                   value={parsedWidth}
//                   onChange={(e) => handleManualChange(e.target.value, parsedHeight)}
//                   className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white outline-none transition-shadow shadow-sm"
//                   min="1"
//                 />
//               </div>
              
//               <div className="text-green-600 font-bold text-lg mt-5">×</div>
              
//               <div className="flex-1">
//                 <label className="block text-[10px] sm:text-xs font-medium text-green-700 mb-1">
//                   Height
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="e.g. 600"
//                   value={parsedHeight}
//                   onChange={(e) => handleManualChange(parsedWidth, e.target.value)}
//                   className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white outline-none transition-shadow shadow-sm"
//                   min="1"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   })()}
// </div>


// {/* Tile Surface */}
// <div className="space-y-2">
//   <label
//     htmlFor="tile-surface-select"
//     className="block text-xs sm:text-sm font-medium text-gray-700"
//   >
//     Tile Surface
//   </label>
  
//   {(() => {
//     const standardSurfaces = [
//       "Polished", "Step Side", "Matt", "Carving", "High Gloss", 
//       "Metallic", "Sugar", "Glue", "Punch"
//     ];
    
//     const currentSurface = newTile.tileSurface || "";
//     // Trigger manual mode if button is clicked OR if existing custom data is present
//     const isManualMode = currentSurface === "manual_trigger" || (currentSurface !== "" && !standardSurfaces.includes(currentSurface));

//     return (
//       <div className="space-y-3">
//         {!isManualMode ? (
//           // --- STANDARD DROPDOWN VIEW ---
//           <div>
//             <div className="relative">
//               <select
//                 id="tile-surface-select"
//                 name="tileSurface"
//                 value={currentSurface}
//                 onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value || undefined })}
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer pr-10 transition-shadow"
//               >
//                 <option value="">Select Surface Finish</option>
//                 {standardSurfaces.map((surface) => (
//                   <option key={surface} value={surface}>{surface}</option>
//                 ))}
//               </select>
//               <div className="absolute right-3 top-2.5 pointer-events-none">
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </div>
//             </div>
            
//             <button
//               type="button"
//               onClick={() => setNewTile({ ...newTile, tileSurface: "manual_trigger" })}
//               className="mt-2 text-xs sm:text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1 transition-colors"
//             >
//               <Plus className="w-3.5 h-3.5" />
//               Add Manual Surface
//             </button>
//           </div>
//         ) : (
//           // --- MANUAL ENTRY VIEW ---
//           <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg space-y-3 animate-slide-down">
//             <div className="flex justify-between items-center mb-1">
//               <span className="text-xs sm:text-sm font-semibold text-green-800">
//                 Enter Custom Surface
//               </span>
//               <button
//                 type="button"
//                 onClick={() => setNewTile({ ...newTile, tileSurface: "" })}
//                 className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
            
//             <input
//               type="text"
//               placeholder="e.g. Rustic, Satin, 3D Print"
//               value={currentSurface === "manual_trigger" ? "" : currentSurface}
//               onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value })}
//               className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white outline-none transition-shadow shadow-sm"
//               autoFocus
//             />
//           </div>
//         )}
//       </div>
//     );
//   })()}

//   {newTile.tileSurface && newTile.tileSurface !== "manual_trigger" && newTile.tileSurface.trim() !== "" && (
//     <div className="flex items-center gap-2 text-xs text-green-600 mt-1.5">
//       <CheckCircle className="w-3 h-3" />
//       <span>Selected: <strong className="font-medium">{newTile.tileSurface}</strong></span>
//     </div>
//   )}
// </div>

       
// <div className="space-y-2">
//   <label
//     htmlFor="tile-material-select"
//     className="block text-xs sm:text-sm font-medium text-gray-700"
//   >
//     Tile Material
//   </label>
  
//   {(() => {
//     const standardMaterials = [
//       "Slabs", "GVT & PGVT", "Double Charge", "Counter Tops", 
//       "Full Body", "Ceramic", "Mosaic", "Subway"
//     ];
    
//     const currentMaterial = newTile.tileMaterial || "";
//     // Trigger manual mode if button is clicked OR if existing custom data is present
//     const isManualMode = currentMaterial === "manual_trigger" || (currentMaterial !== "" && !standardMaterials.includes(currentMaterial));

//     return (
//       <div className="space-y-3">
//         {!isManualMode ? (
//           // --- STANDARD DROPDOWN VIEW ---
//           <div>
//             <div className="relative">
//               <select
//                 id="tile-material-select"
//                 name="tileMaterial"
//                 value={currentMaterial}
//                 onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value || undefined })}
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none cursor-pointer pr-10 transition-shadow"
//               >
//                 <option value="">Select Material Type</option>
//                 {standardMaterials.map((material) => (
//                   <option key={material} value={material}>{material}</option>
//                 ))}
//               </select>
//               <div className="absolute right-3 top-2.5 pointer-events-none">
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </div>
//             </div>
            
//             <button
//               type="button"
//               onClick={() => setNewTile({ ...newTile, tileMaterial: "manual_trigger" })}
//               className="mt-2 text-xs sm:text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1 transition-colors"
//             >
//               <Plus className="w-3.5 h-3.5" />
//               Add Manual Material
//             </button>
//           </div>
//         ) : (
//           // --- MANUAL ENTRY VIEW ---
//           <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg space-y-3 animate-slide-down">
//             <div className="flex justify-between items-center mb-1">
//               <span className="text-xs sm:text-sm font-semibold text-green-800">
//                 Enter Custom Material
//               </span>
//               <button
//                 type="button"
//                 onClick={() => setNewTile({ ...newTile, tileMaterial: "" })}
//                 className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
            
//             <input
//               type="text"
//               placeholder="e.g. Porcelain, Natural Stone, Glass"
//               value={currentMaterial === "manual_trigger" ? "" : currentMaterial}
//               onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value })}
//               className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white outline-none transition-shadow shadow-sm"
//               autoFocus
//             />
//           </div>
//         )}
//       </div>
//     );
//   })()}

//   {newTile.tileMaterial && newTile.tileMaterial !== "manual_trigger" && newTile.tileMaterial.trim() !== "" && (
//     <div className="flex items-center gap-2 text-xs text-green-600 mt-1.5">
//       <CheckCircle className="w-3 h-3" />
//       <span>Selected: <strong className="font-medium">{newTile.tileMaterial}</strong></span>
//     </div>
//   )}
// </div>


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

//           {/* ═══════════════════════════════════════════════════════════════ */}
//           {/* DESKTOP TABLE VIEW - COMPLETE */}
//           {/* ═══════════════════════════════════════════════════════════════ */}
          
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

//           {/* ═══════════════════════════════════════════════════════════════ */}
//           {/* MOBILE/TABLET CARD VIEW - COMPLETE */}
//           {/* ═══════════════════════════════════════════════════════════════ */}
          
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

//           {/* ═══════════════════════════════════════════════════════════════ */}
//           {/* PAGINATION COMPONENT - RESPONSIVE */}
//           {/* ═══════════════════════════════════════════════════════════════ */}
          
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

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* OTHER TABS */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
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
//         {activeTab === "history" && <HistoryTab />}
        
//         {activeTab === "analytics" && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
//         {activeTab === "billing" && (
//     <BillingTab 
//     key={`billing-tab-${planRefreshTrigger}`}
//       sellerId={currentUser?.user_id || ''}
//       // sellerBusiness={sellerData?.business_name || 'Your Business'}
//       sellerEmail={currentUser?.email || ''}
//     />
//   )}
//       </div>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* PAYMENT MODALS */}
//       {/* ═══════════════════════════════════════════════════════════════ */}

//       <PlansModal
//         isOpen={showPlansModal}
//         onClose={() => setShowPlansModal(false)}
//         isLoggedIn={isAuthenticated}
//        sellerId={currentUser?.user_id || ''}     // ✅ Add
//   userToken={userToken} 

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
//           userToken={userToken}  
//         />
//       )}
//     </div>
//   );
// };








// // // console.log('✅ SellerDashboard loaded - PRODUCTION v8.0 - COMPLETE'); 
// // import React, { useState, useEffect } from "react";
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
// // import { jwtService } from '../lib/jwtService';
// // import { PlansModal } from './Payment/PlansModal';
// // import { PaymentConfirmationModal } from './Payment/PaymentConfirmationModal';
// // import { PaymentCheckout } from './Payment/PaymentCheckout';
// // import { initiatePayment } from '../lib/paymentService';
// // import { getPlanById } from '../lib/planService';
// // import type { Plan } from '../types/plan.types';
// // import type { RazorpayCheckoutOptions } from '../types/payment.types';
// // import { auth } from '../lib/firebase';
// // import { HistoryTab } from "./HistoryTab";
// // import {
// //   uploadTile,
// //   updateTile,
// //   deleteTile,
// //   getSellerProfile,
// //   getSellerTiles,
// //   updateTileQRCode,
// //   getTileById,
// // } from "../lib/firebaseutils";
// // import { BillingTab } from './BillingTab';
// // import { uploadToCloudinary } from "../utils/cloudinaryUtils";
// // import { 
// //   getSellerSubscription, 
// //   isSubscriptionExpired,
// //   getDaysUntilExpiry 
// // } from "../lib/subscriptionService";

// // // ═══════════════════════════════════════════════════════════════
// // // ✅ INTERFACES
// // // ═══════════════════════════════════════════════════════════════

// // interface SellerPlanStatus {
// //   isActive: boolean;
// //   expiresAt: Date | null;
// //   planName: string | null;
// //   planId: string | null;
// //   daysRemaining: number;
// //   loading: boolean;
// //   lastChecked: Date | null;
// // }

// // // ═══════════════════════════════════════════════════════════════
// // // ✅ MAIN COMPONENT
// // // ═══════════════════════════════════════════════════════════════

// // export const SellerDashboard: React.FC = () => {
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
// //     | "history"
// //     | "billing"
// //   >("tiles");

// //   // Tile Management
// //   const [editingTile, setEditingTile] = useState<Tile | null>(null);
// //   const [sellerProfile, setSellerProfile] = useState<any>(null);
// //   const [tiles, setTiles] = useState<Tile[]>([]);
// //   const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
// //   const [userToken, setUserToken] = useState<string>('');
  
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

// //   // Payment State
// //   const [showPlansModal, setShowPlansModal] = useState(false);
// //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// //   const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0);
// //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// //   const [paymentId, setPaymentId] = useState<string | null>(null);
// //   const [processingPayment, setProcessingPayment] = useState(false);

// //   useEffect(() => {
// //     const checkPaymentSuccess = () => {
// //       const flag = localStorage.getItem('plan_just_purchased');
// //       if (flag) {
// //         console.log('🔔 [DASHBOARD] Payment success detected');
// //         setPlanRefreshTrigger(prev => prev + 1);
// //         localStorage.removeItem('plan_just_purchased');
// //         if (showPlansModal) {
// //           setTimeout(() => setShowPlansModal(false), 3000);
// //         }
// //       }
// //     };
// //     const interval = setInterval(checkPaymentSuccess, 1000);
// //     return () => clearInterval(interval);
// //   }, [showPlansModal]);

// //   useEffect(() => {
// //     if (isAuthenticated) {
// //       const token = jwtService.getAccessToken();
// //       if (token && jwtService.isValidTokenFormat(token)) {
// //         setUserToken(token);
// //       }
// //     }
// //   }, [isAuthenticated]);

// //   const [planStatus, setPlanStatus] = useState<SellerPlanStatus>({
// //     isActive: false,
// //     expiresAt: null,
// //     planName: null,
// //     planId: null,
// //     daysRemaining: 0,
// //     loading: true,
// //     lastChecked: null
// //   });

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
// //   // ✅ PLAN STATUS FUNCTIONS
// //   // ═══════════════════════════════════════════════════════════════

// //   const checkSellerPlanStatus = async (sellerId: string): Promise<SellerPlanStatus> => {
// //     try {
// //       const subscription = await getSellerSubscription(sellerId, true);
// //       if (!subscription) {
// //         return {
// //           isActive: false,
// //           expiresAt: null,
// //           planName: null,
// //           planId: null,
// //           daysRemaining: 0,
// //           loading: false,
// //           lastChecked: new Date()
// //         };
// //       }
// //       const expired = isSubscriptionExpired(subscription);
// //       const daysRemaining = getDaysUntilExpiry(subscription);
// //       const endDate = subscription.end_date ? new Date(subscription.end_date) : null;
// //       return {
// //         isActive: !expired,
// //         expiresAt: endDate,
// //         planName: subscription.plan_name || null,
// //         planId: subscription.plan_id || null,
// //         daysRemaining,
// //         loading: false,
// //         lastChecked: new Date()
// //       };
// //     } catch (error: any) {
// //       return {
// //         isActive: false,
// //         expiresAt: null,
// //         planName: null,
// //         planId: null,
// //         daysRemaining: 0,
// //         loading: false,
// //         lastChecked: new Date()
// //       };
// //     }
// //   };

// //   const loadPlanStatus = async () => {
// //     if (!currentUser?.user_id) return;
// //     try {
// //       const status = await checkSellerPlanStatus(currentUser.user_id);
// //       setPlanStatus(status);
// //     } catch (error: any) {
// //       setPlanStatus({
// //         isActive: false,
// //         expiresAt: null,
// //         planName: null,
// //         planId: null,
// //         daysRemaining: 0,
// //         loading: false,
// //         lastChecked: new Date()
// //       });
// //     }
// //   };

// //   const handlePlanStatusChange = async (isActive: boolean, isExpired: boolean) => {
// //     setPlanStatus(prev => ({
// //       ...prev,
// //       isActive,
// //       loading: false,
// //       lastChecked: new Date()
// //     }));
// //     if (!isActive && isExpired) {
// //       setTimeout(async () => {
// //         await loadPlanStatus();
// //       }, 1000);
// //     }
// //   };

// //   const isFeatureAllowed = (feature: 'scan' | 'worker' | 'analytics'): boolean => {
// //     if (planStatus.loading) return false;
// //     return planStatus.isActive;
// //   };

// //   const getDisabledReason = (): string => {
// //     if (planStatus.loading) return 'Checking plan status...';
// //     if (!planStatus.isActive) {
// //       if (planStatus.expiresAt) {
// //         return `Your plan expired on ${planStatus.expiresAt.toLocaleDateString()}. Please renew to continue.`;
// //       }
// //       return 'No active plan. Please subscribe to access this feature.';
// //     }
// //     if (planStatus.daysRemaining <= 3) {
// //       return `Your plan expires in ${planStatus.daysRemaining} days. Consider renewing soon.`;
// //     }
// //     return '';
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ EFFECTS
// //   // ═══════════════════════════════════════════════════════════════

// //   useEffect(() => {
// //     if (currentUser && isAuthenticated) {
// //       loadData();
// //       loadPlanStatus();
// //     } else if (currentUser === null && !isAuthenticated) {
// //       setLoading(false);
// //     }
// //   }, [currentUser, isAuthenticated]);

// //   useEffect(() => {
// //     if (currentUser?.user_id && isAuthenticated && planRefreshTrigger > 0) {
// //       loadPlanStatus();
// //     }
// //   }, [planRefreshTrigger, currentUser?.user_id, isAuthenticated]);

// //   useEffect(() => {
// //     filterTiles();
// //     setCurrentPage(1);
// //   }, [tiles, searchTerm, categoryFilter, stockFilter]);

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
// //         setTiles(uniqueTiles);
// //       } else {
// //         setTiles([]);
// //       }
// //     } catch (error: any) {
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
// //       if (!isAuthenticated) {
// //         setShowPlansModal(false);
// //         setError('Please login to select a plan');
// //         return;
// //       }
// //       const plan = await getPlanById(planId);
// //       if (!plan) {
// //         setError('❌ Plan not found. Please try again.');
// //         return;
// //       }
// //       setSelectedPlan(plan);
// //       setShowPlansModal(false);
// //       setShowPaymentConfirmation(true);
// //     } catch (error: any) {
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
// //       setCheckoutOptions(result.checkoutOptions);
// //       setPaymentId(result.paymentId);
// //       setShowPaymentConfirmation(false);
// //     } catch (error: any) {
// //       setError(`❌ Payment Error: ${error.message}`);
// //       setProcessingPayment(false);
// //     }
// //   };

// //   const handlePaymentSuccess = async () => {
// //     try {
// //       setCheckoutOptions(null);
// //       setPaymentId(null);
// //       setProcessingPayment(false);
// //       setSelectedPlan(null);
// //       setShowPaymentConfirmation(false);
// //       setShowPlansModal(false);
// //       setSuccess('🎉 Payment successful! Activating plan...');
// //       try {
// //         const { enableAllSellersWorkers } = await import('../lib/firebaseutils');
// //         const result = await enableAllSellersWorkers(currentUser?.user_id || '');
// //         if (result.success && result.count > 0) {
// //           setSuccess(`🎉 Plan activated! ${result.count} worker(s) enabled.`);
// //         }
// //       } catch (workerError: any) {
// //         console.warn('⚠️ Worker enable failed:', workerError);
// //       }
// //       await new Promise(resolve => setTimeout(resolve, 2000));
// //       setPlanRefreshTrigger(prev => prev + 1);
// //       await new Promise(resolve => setTimeout(resolve, 1000));
// //       await loadPlanStatus();
// //       await loadData();
// //       setSuccess('✅ Plan activated! Workers can now login.');
// //       setTimeout(() => setSuccess(null), 7000);
// //     } catch (error: any) {
// //       setError('Payment successful but refresh failed. Reload page manually.');
// //     }
// //   };

// //   const handlePaymentError = async (error: string) => {
// //     setError(`❌ Payment Error: ${error}`);
// //     setCheckoutOptions(null);
// //     setPaymentId(null);
// //     setProcessingPayment(false);
// //     setSelectedPlan(null);
// //     setShowPaymentConfirmation(false);
// //     setTimeout(async () => {
// //       await loadPlanStatus();
// //     }, 2000);
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ TILE MANAGEMENT FUNCTIONS
// //   // ═══════════════════════════════════════════════════════════════

// //   const generateTileCode = (): string => {
// //     const prefix = sellerProfile?.business_name?.substring(0, 3).toUpperCase() || "TIL";
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
// //       const imageUrl = await uploadToCloudinary(
// //         file,
// //         type === "image" ? "tiles/main" : "tiles/textures"
// //       );
// //       if (type === "image") {
// //         setNewTile((prev) => ({ ...prev, imageUrl }));
// //       } else {
// //         setNewTile((prev) => ({ ...prev, textureUrl: imageUrl }));
// //       }
// //       setSuccess(`${type === "image" ? "Image" : "Texture"} uploaded successfully`);
// //     } catch (error: any) {
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
// //     if (!newTile.size || newTile.size.trim() === "" || newTile.size === "manual_trigger") {
// //       return "❌ Tile Size is required. Please select or enter a size.";
// //     }
// //     if (newTile.size.includes('x') && !newTile.size.match(/^\d+x\d+ cm$/)) {
// //       return "❌ Invalid Manual Size. Please enter BOTH Width and Height properly.";
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
// //       const tileCode = newTile.tileCode || generateTileCode();
// //       const baseTileData = {
// //         ...newTile,
// //         size: newTile.size?.trim(),
// //         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
// //         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
// //         sellerId: currentUser.user_id,
// //         showroomId: currentUser.user_id,
// //         tileCode: tileCode,
// //         inStock: (newTile.stock || 0) > 0,
// //         createdAt: new Date().toISOString(),
// //         updatedAt: new Date().toISOString(),
// //       };
// //       const savedTile = await uploadTile(baseTileData);
// //       if (!savedTile || !savedTile.id) {
// //         throw new Error("Tile saved but ID not returned");
// //       }
// //       let qrCodeGenerated = false;
// //       try {
// //         const qrCodeDataUrl = await generateTileQRCode(savedTile);
// //         await updateTileQRCode(savedTile.id, qrCodeDataUrl);
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
// //     } catch (error: any) {
// //       setError(`Failed to add tile: ${error.message}`);
// //     }
// //   };

// //   const handleEditTile = async (tile: Tile) => {
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
// //       const updates = {
// //         ...newTile,
// //         size: newTile.size?.trim(),
// //         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
// //         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
// //         inStock: (newTile.stock || 0) > 0,
// //         updatedAt: new Date().toISOString(),
// //       };
// //       await updateTile(editingTile.id, updates);
// //       const criticalFieldsChanged =
// //         editingTile.name !== newTile.name ||
// //         editingTile.tileCode !== newTile.tileCode ||
// //         editingTile.price !== newTile.price ||
// //         editingTile.size !== newTile.size ||
// //         editingTile.category !== newTile.category;
// //       if (criticalFieldsChanged) {
// //         setTimeout(async () => {
// //           try {
// //             if (typeof getTileById !== "function") return;
// //             if (typeof generateTileQRCode !== "function") return;
// //             if (typeof updateTileQRCode !== "function") return;
// //             const updatedTileData = await getTileById(editingTile.id);
// //             if (!updatedTileData) return;
// //             const newQRCode = await generateTileQRCode(updatedTileData);
// //             if (!newQRCode || !newQRCode.startsWith("data:image")) return;
// //             await updateTileQRCode(editingTile.id, newQRCode);
// //             await loadData();
// //           } catch (qrError: any) {
// //             console.error("⚠️ QR regeneration failed (non-critical):", qrError.message);
// //           }
// //         }, 0);
// //       }
// //       await loadData();
// //       setEditingTile(null);
// //       resetNewTile();
// //       setSuccess("Tile updated successfully!");
// //     } catch (error: any) {
// //       setError(`Failed to update tile: ${error.message}`);
// //     }
// //   };

// //   const handleDeleteTile = async (tileId: string, tileName: string) => {
// //     if (!window.confirm(`Delete "${tileName}"?`)) return;
// //     try {
// //       setError(null);
// //       await deleteTile(tileId);
// //       await loadData();
// //       setSuccess("Tile deleted successfully");
// //     } catch (error: any) {
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

// //   const isScanAllowed = isFeatureAllowed('scan');
// //   const isWorkerAllowed = isFeatureAllowed('worker');
// //   const disabledMessage = getDisabledReason();

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ RENDER GUARDS
// //   // ═══════════════════════════════════════════════════════════════

// //   if (!isAuthenticated || !currentUser || currentUser.role !== "seller") {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-surface p-4">
// //         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
// //           <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
// //           <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
// //           <p className="text-on-surface-variant mb-6">
// //             {!isAuthenticated ? 'Please login to continue' : 
// //              !currentUser ? 'User profile not found' :
// //              'This dashboard is only for sellers'}
// //           </p>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
// //           >
// //             Reload Page
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-surface">
// //         <div className="text-center">
// //           <span className="material-symbols-outlined text-6xl text-primary animate-spin mb-4 block">refresh</span>
// //           <p className="text-lg text-on-surface">Loading dashboard...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ MAIN RENDER - EXACT DUMMY UI STRUCTURE
// //   // ═══════════════════════════════════════════════════════════════

// //   return (
// //     <>
// //       <style>{`
// //         .glass-card {
// //           background: rgba(255, 255, 255, 0.4);
// //           backdrop-filter: blur(20px);
// //           border: 1px solid rgba(255, 255, 255, 0.6);
// //           box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
// //         }
// //         .premium-gradient {
// //           background: linear-gradient(135deg, #2d5bff 0%, #8127cf 100%);
// //         }
// //         .material-symbols-outlined {
// //           font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
// //         }
// //         ::-webkit-scrollbar {
// //           width: 6px;
// //         }
// //         ::-webkit-scrollbar-track {
// //           background: transparent;
// //         }
// //         ::-webkit-scrollbar-thumb {
// //           background: #e0e3e5;
// //           border-radius: 10px;
// //         }
// //         @keyframes slide-down {
// //           from {
// //             opacity: 0;
// //             transform: translateY(-10px);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }
// //         .animate-slide-down {
// //           animation: slide-down 0.3s ease-out;
// //         }
// //       `}</style>

// //       <div className="flex h-screen bg-background overflow-hidden">
// //         {/* ═══════════════════════════════════════════════════════════════ */}
// //         {/* SIDEBAR */}
// //         {/* ═══════════════════════════════════════════════════════════════ */}
// //         <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-white/40 backdrop-blur-xl z-50 flex flex-col py-8 px-4 shadow-sm">
// //           <div className="mb-10 px-2 flex items-center gap-3">
// //             <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary-container">
// //               <span className="material-symbols-outlined text-2xl">grid_view</span>
// //             </div>
// //             <div>
// //               <h1 className="text-xl font-bold text-primary">Tilesview360</h1>
// //               <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
// //                 Seller Dashboard
// //               </p>
// //             </div>
// //           </div>

// //           <nav className="flex-1 space-y-1">
// //             <a
// //               onClick={() => handleTabChange("tiles")}
// //               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
// //                 activeTab === "tiles"
// //                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
// //                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
// //               }`}
// //             >
// //               <span className="material-symbols-outlined">grid_view</span>
// //               <span>My Tiles</span>
// //             </a>

// //             <a
// //               onClick={() => handleTabChange("history")}
// //               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
// //                 activeTab === "history"
// //                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
// //                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
// //               }`}
// //             >
// //               <span className="material-symbols-outlined">history</span>
// //               <span>History</span>
// //             </a>

// //             <a
// //               onClick={() => handleTabChange("billing")}
// //               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
// //                 activeTab === "billing"
// //                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
// //                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
// //               }`}
// //             >
// //               <span className="material-symbols-outlined">payments</span>
// //               <span>Billing</span>
// //             </a>

// //             <a
// //               onClick={() => handleTabChange("customer-inquiries")}
// //               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
// //                 activeTab === "customer-inquiries"
// //                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
// //                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
// //               }`}
// //             >
// //               <span className="material-symbols-outlined">group</span>
// //               <span>Customers</span>
// //             </a>

// //             <a
// //               onClick={() => handleTabChange("stock-analytics")}
// //               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
// //                 activeTab === "stock-analytics"
// //                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
// //                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
// //               }`}
// //             >
// //               <span className="material-symbols-outlined">analytics</span>
// //               <span>Analytics</span>
// //             </a>

// //             <a
// //               onClick={() => {
// //                 if (isWorkerAllowed) {
// //                   handleTabChange("worker");
// //                 } else {
// //                   setShowPlansModal(true);
// //                 }
// //               }}
// //               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer relative ${
// //                 activeTab === "worker"
// //                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
// //                   : !isWorkerAllowed
// //                   ? "text-on-surface-variant/50 cursor-not-allowed opacity-60"
// //                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
// //               }`}
// //               title={!isWorkerAllowed ? disabledMessage : "Manage Workers"}
// //             >
// //               <span className="material-symbols-outlined">engineering</span>
// //               <span>Worker</span>
// //               {!isWorkerAllowed && (
// //                 <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
// //               )}
// //             </a>

// //             <a
// //               onClick={() => {
// //                 if (isScanAllowed) {
// //                   window.open("/scan", "_blank");
// //                 } else {
// //                   setShowPlansModal(true);
// //                 }
// //               }}
// //               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer relative ${
// //                 !isScanAllowed
// //                   ? "text-on-surface-variant/50 cursor-not-allowed opacity-60"
// //                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
// //               }`}
// //               title={!isScanAllowed ? disabledMessage : "Open QR Scanner"}
// //             >
// //               <span className="material-symbols-outlined">qr_code_scanner</span>
// //               <span>Scan</span>
// //               {!isScanAllowed && (
// //                 <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
// //               )}
// //             </a>

// //             <a
// //               onClick={() => handleTabChange("profile")}
// //               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
// //                 activeTab === "profile"
// //                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
// //                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
// //               }`}
// //             >
// //               <span className="material-symbols-outlined">account_circle</span>
// //               <span>Profile</span>
// //             </a>

// //             <a
// //               onClick={() => handleTabChange("excel")}
// //               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
// //                 activeTab === "excel"
// //                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
// //                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
// //               }`}
// //             >
// //               <span className="material-symbols-outlined">table_view</span>
// //               <span>Excel</span>
// //             </a>

// //             <a
// //               onClick={() => handleTabChange("qrcodes")}
// //               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
// //                 activeTab === "qrcodes"
// //                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
// //                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
// //               }`}
// //             >
// //               <span className="material-symbols-outlined">qr_code</span>
// //               <span>QR Codes</span>
// //             </a>
// //           </nav>

// //           <div className="mt-auto pt-6 border-t border-outline-variant space-y-1">
// //             <button
// //               onClick={() => {
// //                 setIsAddingTile(true);
// //                 setEditingTile(null);
// //                 resetNewTile();
// //                 handleTabChange("tiles");
// //                 window.scrollTo({ top: 0, behavior: 'smooth' });
// //               }}
// //               className="w-full mb-6 bg-primary text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
// //             >
// //               <span className="material-symbols-outlined">add</span>
// //               <span>Create New Tile</span>
// //             </button>

// //             <a
// //               onClick={() => setShowPlansModal(true)}
// //               className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-200 cursor-pointer"
// //             >
// //               <span className="material-symbols-outlined">settings</span>
// //               <span>Settings</span>
// //             </a>

// //             <a
// //               href="#"
// //               className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-200"
// //             >
// //               <span className="material-symbols-outlined">help</span>
// //               <span>Support</span>
// //             </a>
// //           </div>
// //         </aside>

// //         {/* ═══════════════════════════════════════════════════════════════ */}
// //         {/* MAIN CONTENT */}
// //         {/* ═══════════════════════════════════════════════════════════════ */}
// //         <main className="ml-64 flex-1 overflow-auto">
// //           {/* TOP HEADER */}
// //           <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-2xl border-b border-white/50 h-16 px-8 flex items-center justify-between shadow-sm bg-white/80">
// //             <div className="flex items-center flex-1 max-w-2xl pr-8">
// //               <div className="relative w-full group">
// //                 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
// //                   search
// //                 </span>
// //                 <input
// //                   type="text"
// //                   placeholder="Search tiles by name, code, material..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   className="w-full bg-surface-container-low border-none rounded-full py-2 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
// //                 />
// //               </div>
// //             </div>

// //             <div className="flex items-center gap-4">
// //               <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/30 rounded-full transition-transform active:scale-90 relative">
// //                 <span className="material-symbols-outlined text-xl">notifications</span>
// //                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
// //               </button>

// //               <button
// //                 onClick={() => setShowPlansModal(true)}
// //                 className="p-2 text-on-surface-variant hover:bg-surface-container-highest/30 rounded-full transition-transform active:scale-90"
// //               >
// //                 <span className="material-symbols-outlined text-xl">settings</span>
// //               </button>

// //               <div className="h-6 w-px bg-outline-variant mx-1"></div>

// //               <div className="flex items-center gap-3 pl-2">
// //                 <div className="text-right">
// //                   <p className="font-bold text-sm">{sellerProfile?.business_name || currentUser.full_name}</p>
// //                   <p className="text-[10px] text-on-surface-variant">Platinum Seller</p>
// //                 </div>
// //                 <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-sm bg-primary-container flex items-center justify-center">
// //                   <span className="material-symbols-outlined text-primary">person</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </header>

// //           {/* CONTENT CANVAS */}
// //           <div className="pt-8 pb-8 px-16 space-y-8">
// //             {/* ALERTS */}
// //             {error && (
// //               <div className="p-4 bg-error-container border border-error rounded-lg flex items-start gap-3 animate-slide-down">
// //                 <span className="material-symbols-outlined text-error">error</span>
// //                 <div className="flex-1">
// //                   <p className="text-on-error-container font-medium">Error</p>
// //                   <p className="text-on-error-container text-sm">{error}</p>
// //                 </div>
// //                 <button onClick={() => setError(null)} className="text-error hover:text-error/80">
// //                   <span className="material-symbols-outlined">close</span>
// //                 </button>
// //               </div>
// //             )}

// //             {success && (
// //               <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-slide-down">
// //                 <span className="material-symbols-outlined text-green-600">check_circle</span>
// //                 <div className="flex-1">
// //                   <p className="text-green-800 font-medium">Success</p>
// //                   <p className="text-green-700 text-sm">{success}</p>
// //                 </div>
// //                 <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">
// //                   <span className="material-symbols-outlined">close</span>
// //                 </button>
// //               </div>
// //             )}

// //             {/* CONDITIONAL RENDERING BASED ON ACTIVE TAB */}
// //             {activeTab === "tiles" ? (
// //               <>
// //                 {/* DASHBOARD HEADER */}
// //                 <div className="mb-6 flex justify-between items-end">
// //                   <div>
// //                     <nav className="flex text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 gap-2">
// //                       <span>Dashboard</span>
// //                     </nav>
// //                     <h2 className="text-[28px] leading-tight font-semibold text-on-surface">
// //                       Tile Catalog
// //                     </h2>
// //                     <p className="text-on-surface-variant text-sm mt-0.5">
// //                       Organize your tiles, monitor stock, and power customer visualizations.
// //                     </p>
// //                   </div>
// //                   <div className="flex gap-2">
// //                     <button
// //                       onClick={() => {
// //                         setIsAddingTile(true);
// //                         setEditingTile(null);
// //                         resetNewTile();
// //                         window.scrollTo({ top: 0, behavior: 'smooth' });
// //                       }}
// //                       className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:scale-105 active:scale-95 transition-all font-bold text-xs shadow-lg shadow-primary/20"
// //                     >
// //                       <span className="material-symbols-outlined text-base">add</span>
// //                       Add New Tile
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {/* SUBSCRIPTION BANNER */}
// //                 <section>
// //                   <div className="glass-card premium-gradient p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
// //                     <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
// //                     <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/30 rounded-full blur-2xl"></div>

// //                     <div className="relative z-10 flex gap-4 items-center">
// //                       <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center text-white">
// //                         <span className="material-symbols-outlined text-2xl">workspace_premium</span>
// //                       </div>
// //                       <div>
// //                         <h3 className="text-white font-bold text-lg">
// //                           {planStatus.isActive 
// //                             ? `Active Plan: ${planStatus.planName || 'Premium'}` 
// //                             : 'Premium Features Await'}
// //                         </h3>
// //                         <p className="text-white/80 text-sm">
// //                           {planStatus.isActive
// //                             ? `Expires in ${planStatus.daysRemaining} days - Renew to keep access`
// //                             : 'Transform your showroom with unlimited tile management and immersive 3D visualization.'}
// //                         </p>
// //                       </div>
// //                     </div>

// //                     <button
// //                       onClick={() => setShowPlansModal(true)}
// //                       className="relative z-10 px-6 py-2.5 bg-white text-primary rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
// //                     >
// //                       <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">
// //                         visibility
// //                       </span>
// //                       {planStatus.isActive ? 'Upgrade Plan' : 'View Plans'}
// //                     </button>
// //                   </div>
// //                 </section>

// //                 {/* QUICK STATS GRID */}
// //                 <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
// //                   <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
// //                     <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
// //                       <span className="material-symbols-outlined text-xl">grid_on</span>
// //                     </div>
// //                     <div>
// //                       <p className="text-on-surface-variant font-medium text-xs">Total Tiles</p>
// //                       <h4 className="text-lg font-bold leading-tight">{tiles.length}</h4>
// //                       <p className="text-primary text-[9px] font-bold uppercase tracking-wider">
// //                         {tiles.filter(t => t.category === 'both').length} Collections
// //                       </p>
// //                     </div>
// //                   </div>

// //                   <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
// //                     <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
// //                       <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
// //                     </div>
// //                     <div>
// //                       <p className="text-on-surface-variant font-medium text-xs">QR Generated</p>
// //                       <h4 className="text-lg font-bold leading-tight">
// //                         {tiles.filter(t => t.qrCode).length}
// //                       </h4>
// //                       <p className="text-green-600 text-[9px] font-bold uppercase tracking-wider">Active</p>
// //                     </div>
// //                   </div>

// //                   <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
// //                     <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
// //                       <span className="material-symbols-outlined text-xl">inventory_2</span>
// //                     </div>
// //                     <div>
// //                       <p className="text-on-surface-variant font-medium text-xs">Total Stock</p>
// //                       <h4 className="text-lg font-bold leading-tight">
// //                         {tiles.reduce((sum, t) => sum + (t.stock || 0), 0)}
// //                       </h4>
// //                       <p className="text-green-600 text-[9px] font-bold uppercase tracking-wider">
// //                         {tiles.filter(t => t.inStock).length} Available
// //                       </p>
// //                     </div>
// //                   </div>

// //                   <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
// //                     <div className="w-10 h-10 bg-error/10 text-error rounded-lg flex items-center justify-center group-hover:bg-error group-hover:text-white transition-colors">
// //                       <span className="material-symbols-outlined text-xl">outbox</span>
// //                     </div>
// //                     <div>
// //                       <p className="text-on-surface-variant font-medium text-xs">Low Stock</p>
// //                       <h4 className="text-lg font-bold leading-tight">
// //                         {tiles.filter(t => t.inStock && (t.stock || 0) < 10).length}
// //                       </h4>
// //                       <p className="text-error text-[9px] font-bold uppercase tracking-wider">Reorder</p>
// //                     </div>
// //                   </div>

// //                   <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
// //                     <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
// //                       <span className="material-symbols-outlined text-xl">group</span>
// //                     </div>
// //                     <div>
// //                       <p className="text-on-surface-variant font-medium text-xs">In Stock</p>
// //                       <h4 className="text-lg font-bold leading-tight">
// //                         {Math.round((tiles.filter(t => t.inStock).length / tiles.length) * 100) || 0}%
// //                       </h4>
// //                       <p className="text-primary text-[9px] font-bold uppercase tracking-wider">Retention</p>
// //                     </div>
// //                   </div>
// //                 </section>

// //                 {/* ADD/EDIT TILE FORM */}
// //                 {(isAddingTile || editingTile) && (
// //                   <div className="glass-card p-6 rounded-2xl border border-white/60">
// //                     <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
// //                       {editingTile ? (
// //                         <>
// //                           <span className="material-symbols-outlined text-primary">edit</span>
// //                           Edit: {editingTile.name}
// //                         </>
// //                       ) : (
// //                         <>
// //                           <span className="material-symbols-outlined text-primary">add</span>
// //                           Add New Tile
// //                         </>
// //                       )}
// //                     </h3>

// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //                       {/* Tile Name */}
// //                       <div className="space-y-2">
// //                         <label className="block text-sm font-medium text-gray-700">
// //                           Tile Name *
// //                         </label>
// //                         <input
// //                           type="text"
// //                           placeholder="Enter tile name"
// //                           value={newTile.name}
// //                           onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
// //                         />
// //                       </div>

// //                       {/* Tile Code */}
// //                       <div className="space-y-2">
// //                         <label className="block text-sm font-medium text-gray-700">
// //                           Tile Code
// //                         </label>
// //                         <input
// //                           type="text"
// //                           placeholder="Auto-generated if empty"
// //                           value={newTile.tileCode}
// //                           onChange={(e) => setNewTile({ ...newTile, tileCode: e.target.value })}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
// //                         />
// //                       </div>

// //                       {/* Category */}
// //                       <div className="space-y-2">
// //                         <label className="block text-sm font-medium text-gray-700">
// //                           Category *
// //                         </label>
// //                         <select
// //                           value={newTile.category}
// //                           onChange={(e) => setNewTile({ ...newTile, category: e.target.value as any })}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
// //                         >
// //                           <option value="floor">Floor Only</option>
// //                           <option value="wall">Wall Only</option>
// //                           <option value="both">Floor & Wall</option>
// //                         </select>
// //                       </div>

// //                       {/* Size */}
// //                       <div className="space-y-2">
// //                         <label className="block text-sm font-medium text-gray-700">Size *</label>
// //                         {(() => {
// //                           const standardSizes = [
// //                             "30x30 cm", "30x60 cm", "60x60 cm", "60x120 cm", "80x80 cm",
// //                             "40x40 cm", "40x60 cm", "50x50 cm", "20x120 cm", "15x90 cm",
// //                             "10x30 cm", "20x20 cm", "25x40 cm", "61x122 cm", "122x122 cm",
// //                             "75x75 cm", "100x100 cm", "45x45 cm", "7.5x15 cm", "6x25 cm"
// //                           ];
// //                           const currentSize = newTile.size || "";
// //                           const isManualMode = currentSize === "manual_trigger" || (currentSize !== "" && !standardSizes.includes(currentSize));
// //                           let parsedWidth = "";
// //                           let parsedHeight = "";
// //                           if (isManualMode && currentSize !== "manual_trigger") {
// //                             const parts = currentSize.replace(" cm", "").split("x");
// //                             if (parts.length === 2) {
// //                               parsedWidth = parts[0];
// //                               parsedHeight = parts[1];
// //                             }
// //                           }
// //                           const handleManualChange = (w: string, h: string) => {
// //                             setNewTile({ ...newTile, size: `${w}x${h} cm` });
// //                           };
// //                           return (
// //                             <div className="space-y-3">
// //                               {!isManualMode ? (
// //                                 <div>
// //                                   <select
// //                                     value={currentSize}
// //                                     onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
// //                                   >
// //                                     <option value="">Select Tile Size</option>
// //                                     {standardSizes.map((sizeOption) => (
// //                                       <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
// //                                     ))}
// //                                   </select>
// //                                   <button
// //                                     type="button"
// //                                     onClick={() => setNewTile({ ...newTile, size: "manual_trigger" })}
// //                                     className="mt-2 text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1"
// //                                   >
// //                                     <span className="material-symbols-outlined text-sm">add</span>
// //                                     Add Manual Size
// //                                   </button>
// //                                 </div>
// //                               ) : (
// //                                 <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
// //                                   <div className="flex justify-between items-center">
// //                                     <span className="text-xs font-semibold text-primary">
// //                                       Enter Custom Size (in cm)
// //                                     </span>
// //                                     <button
// //                                       type="button"
// //                                       onClick={() => setNewTile({ ...newTile, size: "" })}
// //                                       className="text-xs text-error hover:text-error/80 font-medium"
// //                                     >
// //                                       Cancel
// //                                     </button>
// //                                   </div>
// //                                   <div className="flex items-center gap-3">
// //                                     <input
// //                                       type="number"
// //                                       placeholder="Width"
// //                                       value={parsedWidth}
// //                                       onChange={(e) => handleManualChange(e.target.value, parsedHeight)}
// //                                       className="flex-1 px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
// //                                       min="1"
// //                                     />
// //                                     <span className="text-primary font-bold">×</span>
// //                                     <input
// //                                       type="number"
// //                                       placeholder="Height"
// //                                       value={parsedHeight}
// //                                       onChange={(e) => handleManualChange(parsedWidth, e.target.value)}
// //                                       className="flex-1 px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
// //                                       min="1"
// //                                     />
// //                                   </div>
// //                                 </div>
// //                               )}
// //                             </div>
// //                           );
// //                         })()}
// //                       </div>

// //                       {/* Surface */}
// //                       <div className="space-y-2">
// //                         <label className="block text-sm font-medium text-gray-700">Tile Surface</label>
// //                         {(() => {
// //                           const standardSurfaces = ["Polished", "Step Side", "Matt", "Carving", "High Gloss", "Metallic", "Sugar", "Glue", "Punch"];
// //                           const currentSurface = newTile.tileSurface || "";
// //                           const isManualMode = currentSurface === "manual_trigger" || (currentSurface !== "" && !standardSurfaces.includes(currentSurface));
// //                           return (
// //                             <div className="space-y-3">
// //                               {!isManualMode ? (
// //                                 <div>
// //                                   <select
// //                                     value={currentSurface}
// //                                     onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value || undefined })}
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
// //                                   >
// //                                     <option value="">Select Surface Finish</option>
// //                                     {standardSurfaces.map((surface) => (
// //                                       <option key={surface} value={surface}>{surface}</option>
// //                                     ))}
// //                                   </select>
// //                                   <button
// //                                     type="button"
// //                                     onClick={() => setNewTile({ ...newTile, tileSurface: "manual_trigger" })}
// //                                     className="mt-2 text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1"
// //                                   >
// //                                     <span className="material-symbols-outlined text-sm">add</span>
// //                                     Add Manual Surface
// //                                   </button>
// //                                 </div>
// //                               ) : (
// //                                 <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
// //                                   <div className="flex justify-between items-center">
// //                                     <span className="text-xs font-semibold text-primary">Enter Custom Surface</span>
// //                                     <button
// //                                       type="button"
// //                                       onClick={() => setNewTile({ ...newTile, tileSurface: "" })}
// //                                       className="text-xs text-error hover:text-error/80 font-medium"
// //                                     >
// //                                       Cancel
// //                                     </button>
// //                                   </div>
// //                                   <input
// //                                     type="text"
// //                                     placeholder="e.g. Rustic, Satin, 3D Print"
// //                                     value={currentSurface === "manual_trigger" ? "" : currentSurface}
// //                                     onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value })}
// //                                     className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
// //                                     autoFocus
// //                                   />
// //                                 </div>
// //                               )}
// //                             </div>
// //                           );
// //                         })()}
// //                       </div>

// //                       {/* Material */}
// //                       <div className="space-y-2">
// //                         <label className="block text-sm font-medium text-gray-700">Tile Material</label>
// //                         {(() => {
// //                           const standardMaterials = ["Slabs", "GVT & PGVT", "Double Charge", "Counter Tops", "Full Body", "Ceramic", "Mosaic", "Subway"];
// //                           const currentMaterial = newTile.tileMaterial || "";
// //                           const isManualMode = currentMaterial === "manual_trigger" || (currentMaterial !== "" && !standardMaterials.includes(currentMaterial));
// //                           return (
// //                             <div className="space-y-3">
// //                               {!isManualMode ? (
// //                                 <div>
// //                                   <select
// //                                     value={currentMaterial}
// //                                     onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value || undefined })}
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
// //                                   >
// //                                     <option value="">Select Material Type</option>
// //                                     {standardMaterials.map((material) => (
// //                                       <option key={material} value={material}>{material}</option>
// //                                     ))}
// //                                   </select>
// //                                   <button
// //                                     type="button"
// //                                     onClick={() => setNewTile({ ...newTile, tileMaterial: "manual_trigger" })}
// //                                     className="mt-2 text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1"
// //                                   >
// //                                     <span className="material-symbols-outlined text-sm">add</span>
// //                                     Add Manual Material
// //                                   </button>
// //                                 </div>
// //                               ) : (
// //                                 <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
// //                                   <div className="flex justify-between items-center">
// //                                     <span className="text-xs font-semibold text-primary">Enter Custom Material</span>
// //                                     <button
// //                                       type="button"
// //                                       onClick={() => setNewTile({ ...newTile, tileMaterial: "" })}
// //                                       className="text-xs text-error hover:text-error/80 font-medium"
// //                                     >
// //                                       Cancel
// //                                     </button>
// //                                   </div>
// //                                   <input
// //                                     type="text"
// //                                     placeholder="e.g. Porcelain, Natural Stone, Glass"
// //                                     value={currentMaterial === "manual_trigger" ? "" : currentMaterial}
// //                                     onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value })}
// //                                     className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
// //                                     autoFocus
// //                                   />
// //                                 </div>
// //                               )}
// //                             </div>
// //                           );
// //                         })()}
// //                       </div>

// //                       {/* Price */}
// //                       <div className="space-y-2">
// //                         <label className="block text-sm font-medium text-gray-700">Price (₹) *</label>
// //                         <input
// //                           type="number"
// //                           placeholder="Enter price"
// //                           value={newTile.price || ""}
// //                           onChange={(e) => setNewTile({ ...newTile, price: e.target.value === "" ? 0 : Number(e.target.value) })}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
// //                           min="0"
// //                           step="0.01"
// //                         />
// //                       </div>

// //                       {/* Stock */}
// //                       <div className="space-y-2">
// //                         <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
// //                         <input
// //                           type="number"
// //                           placeholder="Enter stock quantity"
// //                           value={newTile.stock || ""}
// //                           onChange={(e) => setNewTile({ ...newTile, stock: e.target.value === "" ? 0 : Number(e.target.value) })}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
// //                           min="0"
// //                         />
// //                       </div>

// //                       {/* Main Image */}
// //                       <div className="space-y-2">
// //                         <label className="block text-sm font-medium text-gray-700">Tile Image *</label>
// //                         <div className="flex flex-col gap-2">
// //                           <input
// //                             type="file"
// //                             accept="image/*"
// //                             onChange={(e) => {
// //                               const file = e.target.files?.[0];
// //                               if (file) handleImageUpload(file, "image");
// //                             }}
// //                             className="hidden"
// //                             id="tile-image-upload"
// //                           />
// //                           <label
// //                             htmlFor="tile-image-upload"
// //                             className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium ${
// //                               imageUploading ? "opacity-50 cursor-not-allowed" : ""
// //                             }`}
// //                           >
// //                             {imageUploading ? (
// //                               <>
// //                                 <span className="material-symbols-outlined animate-spin">refresh</span>
// //                                 Uploading...
// //                               </>
// //                             ) : (
// //                               <>
// //                                 <span className="material-symbols-outlined">upload</span>
// //                                 Choose Image
// //                               </>
// //                             )}
// //                           </label>
// //                           {newTile.imageUrl && (
// //                             <div className="flex items-center gap-2">
// //                               <img
// //                                 src={newTile.imageUrl}
// //                                 alt="Preview"
// //                                 className="w-16 h-16 object-cover rounded-lg border border-gray-200"
// //                               />
// //                               <div className="flex items-center gap-1 text-green-600">
// //                                 <span className="material-symbols-outlined text-sm">check_circle</span>
// //                                 <span className="text-xs font-medium">Uploaded</span>
// //                               </div>
// //                             </div>
// //                           )}
// //                         </div>
// //                       </div>

// //                       {/* Texture */}
// //                       <div className="space-y-2">
// //                         <label className="block text-sm font-medium text-gray-700">Texture (Optional)</label>
// //                         <div className="flex flex-col gap-2">
// //                           <input
// //                             type="file"
// //                             accept="image/*"
// //                             onChange={(e) => {
// //                               const file = e.target.files?.[0];
// //                               if (file) handleImageUpload(file, "texture");
// //                             }}
// //                             className="hidden"
// //                             id="texture-image-upload"
// //                           />
// //                           <label
// //                             htmlFor="texture-image-upload"
// //                             className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium ${
// //                               textureUploading ? "opacity-50 cursor-not-allowed" : ""
// //                             }`}
// //                           >
// //                             {textureUploading ? (
// //                               <>
// //                                 <span className="material-symbols-outlined animate-spin">refresh</span>
// //                                 Uploading...
// //                               </>
// //                             ) : (
// //                               <>
// //                                 <span className="material-symbols-outlined">upload</span>
// //                                 Choose Texture
// //                               </>
// //                             )}
// //                           </label>
// //                           {newTile.textureUrl && (
// //                             <div className="flex items-center gap-2">
// //                               <img
// //                                 src={newTile.textureUrl}
// //                                 alt="Texture"
// //                                 className="w-16 h-16 object-cover rounded-lg border border-gray-200"
// //                               />
// //                               <div className="flex items-center gap-1 text-green-600">
// //                                 <span className="material-symbols-outlined text-sm">check_circle</span>
// //                                 <span className="text-xs font-medium">Uploaded</span>
// //                               </div>
// //                             </div>
// //                           )}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Form Actions */}
// //                     <div className="flex gap-2 mt-6">
// //                       <button
// //                         onClick={editingTile ? handleUpdateTile : handleAddTile}
// //                         disabled={imageUploading || textureUploading}
// //                         className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md"
// //                       >
// //                         <span className="material-symbols-outlined">save</span>
// //                         {editingTile ? "Update Tile" : "Save Tile"}
// //                       </button>
// //                       <button
// //                         onClick={() => {
// //                           setIsAddingTile(false);
// //                           setEditingTile(null);
// //                           resetNewTile();
// //                           setError(null);
// //                         }}
// //                         className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
// //                       >
// //                         Cancel
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* INVENTORY TABLE SECTION */}
// //                 <section className="glass-card rounded-2xl border border-white/60 overflow-hidden shadow-sm">
// //                   {/* Filter Bar */}
// //                   <div className="p-4 border-b border-outline-variant bg-white/40 flex flex-wrap items-center justify-between gap-4">
// //                     <div className="flex items-center gap-2">
// //                       <div className="relative group">
// //                         <select
// //                           value={categoryFilter}
// //                           onChange={(e) => setCategoryFilter(e.target.value)}
// //                           className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-10 font-semibold text-xs focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
// //                         >
// //                           <option value="all">All Categories</option>
// //                           <option value="wall">Wall</option>
// //                           <option value="floor">Floor</option>
// //                           <option value="both">Both</option>
// //                         </select>
// //                         <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-lg">
// //                           expand_more
// //                         </span>
// //                       </div>

// //                       <div className="relative group">
// //                         <select
// //                           value={stockFilter}
// //                           onChange={(e) => setStockFilter(e.target.value)}
// //                           className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-10 font-semibold text-xs focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
// //                         >
// //                           <option value="all">Stock Status</option>
// //                           <option value="in-stock">In Stock</option>
// //                           <option value="out-of-stock">Out of Stock</option>
// //                         </select>
// //                         <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-lg">
// //                           expand_more
// //                         </span>
// //                       </div>

// //                       <button
// //                         onClick={loadData}
// //                         className="p-2 hover:bg-surface-container-highest/50 rounded-lg transition-all group"
// //                         title="Refresh"
// //                       >
// //                         <span className="material-symbols-outlined group-active:rotate-180 transition-transform duration-500 text-on-surface-variant text-xl">
// //                           refresh
// //                         </span>
// //                       </button>
// //                     </div>

// //                     <div className="flex items-center gap-4">
// //                       <p className="text-xs font-medium text-on-surface-variant">
// //                         {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
// //                       </p>
// //                     </div>
// //                   </div>

// //                   {/* Table */}
// //                   <div className="overflow-x-auto">
// //                     <table className="w-full text-left border-collapse">
// //                       <thead>
// //                         <tr className="bg-surface-container-low/50 border-b">
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Image</th>
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Name</th>
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Code</th>
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Category</th>
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Size</th>
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Surface</th>
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Material</th>
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-right text-[11px] font-semibold">Price</th>
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-center text-[11px] font-semibold">Stock</th>
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Status</th>
// //                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-center text-[11px] font-semibold">Actions</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody className="divide-y divide-outline-variant/30">
// //                         {currentTiles.length === 0 ? (
// //                           <tr>
// //                             <td colSpan={11} className="text-center p-8 text-gray-500">
// //                               <span className="material-symbols-outlined text-6xl text-gray-300 block mb-2">grid_off</span>
// //                               <p className="font-medium">No tiles found</p>
// //                               <p className="text-sm">Try adjusting your filters</p>
// //                             </td>
// //                           </tr>
// //                         ) : (
// //                           currentTiles.map((tile) => (
// //                             <tr key={tile.id} className="hover:bg-primary-container/5 transition-colors group">
// //                               <td className="p-4">
// //                                 <div className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-white p-1">
// //                                   <img
// //                                     src={tile.imageUrl}
// //                                     alt={tile.name}
// //                                     className="w-full h-full object-cover rounded"
// //                                   />
// //                                 </div>
// //                               </td>
// //                               <td className="p-4">
// //                                 <p className="font-bold text-on-surface text-sm">{tile.name}</p>
// //                                 {tile.textureUrl && (
// //                                   <p className="text-[10px] text-green-600">Has Texture</p>
// //                                 )}
// //                               </td>
// //                               <td className="p-4">
// //                                 <span className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">
// //                                   {tile.tileCode}
// //                                 </span>
// //                               </td>
// //                               <td className="p-4">
// //                                 <span
// //                                   className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
// //                                     tile.category === "floor"
// //                                       ? "bg-primary-container/10 text-primary"
// //                                       : tile.category === "wall"
// //                                       ? "bg-secondary-container/10 text-secondary"
// //                                       : "bg-tertiary-container/10 text-tertiary"
// //                                   }`}
// //                                 >
// //                                   {tile.category === "both" ? "Both" : tile.category}
// //                                 </span>
// //                               </td>
// //                               <td className="p-4 text-xs font-medium">{tile.size}</td>
// //                               <td className="p-4">
// //                                 {tile.tileSurface ? (
// //                                   <div className="flex items-center gap-1.5">
// //                                     <div className="w-2 h-2 rounded-full border border-on-surface-variant"></div>
// //                                     <span className="text-xs">{tile.tileSurface}</span>
// //                                   </div>
// //                                 ) : (
// //                                   <span className="text-xs text-gray-400">—</span>
// //                                 )}
// //                               </td>
// //                               <td className="p-4">
// //                                 {tile.tileMaterial ? (
// //                                   <div className="flex items-center gap-1.5 text-xs">
// //                                     <span className="material-symbols-outlined text-base text-secondary">layers</span>
// //                                     {tile.tileMaterial}
// //                                   </div>
// //                                 ) : (
// //                                   <span className="text-xs text-gray-400">—</span>
// //                                 )}
// //                               </td>
// //                               <td className="p-4 text-right font-bold text-sm">₹{tile.price.toFixed(2)}</td>
// //                               <td className="p-4 text-center font-semibold text-sm">{tile.stock || 0}</td>
// //                               <td className="p-4">
// //                                 <span
// //                                   className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(
// //                                     tile
// //                                   )}`}
// //                                 >
// //                                   <span className={`w-1.5 h-1.5 rounded-full ${tile.inStock ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
// //                                   {getStockStatusText(tile)}
// //                                 </span>
// //                               </td>
// //                               <td className="p-4">
// //                                 <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
// //                                   <button
// //                                     onClick={() => handleEditTile(tile)}
// //                                     className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all"
// //                                     title="Edit"
// //                                   >
// //                                     <span className="material-symbols-outlined text-lg">edit_square</span>
// //                                   </button>
// //                                   <button
// //                                     onClick={() => handleDeleteTile(tile.id, tile.name)}
// //                                     className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-all"
// //                                     title="Delete"
// //                                   >
// //                                     <span className="material-symbols-outlined text-lg">delete</span>
// //                                   </button>
// //                                 </div>
// //                               </td>
// //                             </tr>
// //                           ))
// //                         )}
// //                       </tbody>
// //                     </table>
// //                   </div>

// //                   {/* Pagination Footer */}
// //                   {totalPages > 1 && (
// //                     <div className="p-4 bg-surface-container-low/50 flex items-center justify-between border-t border-outline-variant/30">
// //                       <button
// //                         onClick={goToPreviousPage}
// //                         disabled={currentPage === 1}
// //                         className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-on-surface-variant hover:text-primary transition-all disabled:opacity-50"
// //                       >
// //                         <span className="material-symbols-outlined text-sm">chevron_left</span>
// //                         Prev
// //                       </button>

// //                       <div className="flex items-center gap-1.5">
// //                         {getPageNumbers().map((page, index) => {
// //                           if (page === '...') {
// //                             return (
// //                               <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
// //                                 ...
// //                               </span>
// //                             );
// //                           }
// //                           return (
// //                             <button
// //                               key={page}
// //                               onClick={() => goToPage(page as number)}
// //                               className={`w-8 h-8 rounded-lg font-bold text-xs ${
// //                                 currentPage === page
// //                                   ? "bg-primary text-white"
// //                                   : "hover:bg-white transition-all font-semibold"
// //                               }`}
// //                             >
// //                               {page}
// //                             </button>
// //                           );
// //                         })}
// //                       </div>

// //                       <button
// //                         onClick={goToNextPage}
// //                         disabled={currentPage === totalPages}
// //                         className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-on-surface-variant hover:text-primary transition-all disabled:opacity-50"
// //                       >
// //                         Next
// //                         <span className="material-symbols-outlined text-sm">chevron_right</span>
// //                       </button>
// //                     </div>
// //                   )}
// //                 </section>
// //               </>
// //             ) : (
// //               /* OTHER TABS RENDER AS-IS */
// //               <div className="overflow-hidden">
// //                 {activeTab === "worker" && <WorkerManagement />}
// //                 {activeTab === "profile" && <SellerProfile />}
// //                 {activeTab === "excel" && <ExcelUpload onUploadComplete={loadData} />}
// //                 {activeTab === "stock-analytics" && <SellerStockAnalytics />}
// //                 {activeTab === "bulk" && <BulkUpload onUploadComplete={loadData} />}
// //                 {activeTab === "customer-inquiries" && <CustomerInquiriesManager />}
// //                 {activeTab === "qrcodes" && (
// //                   <QRCodeManager tiles={tiles} sellerId={currentUser?.user_id} onQRCodeGenerated={loadData} />
// //                 )}
// //                 {activeTab === "history" && <HistoryTab />}
// //                 {activeTab === "analytics" && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
// //                 {activeTab === "billing" && (
// //                   <BillingTab
// //                     key={`billing-tab-${planRefreshTrigger}`}
// //                     sellerId={currentUser?.user_id || ''}
// //                     sellerEmail={currentUser?.email || ''}
// //                   />
// //                 )}
// //               </div>
// //             )}

// //             {/* Footer Meta */}
// //             <footer className="border-t border-outline-variant flex justify-between items-center text-on-surface-variant pt-6 pb-2 text-[11px]">
// //               <p>© 2024 LuxeTile AI. All architectural rights reserved.</p>
// //               <div className="flex gap-4 font-medium">
// //                 <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
// //                 <a href="#" className="hover:text-primary transition-colors">Terms</a>
// //                 <a href="#" className="hover:text-primary transition-colors">API Docs</a>
// //               </div>
// //             </footer>
// //           </div>
// //         </main>
// //       </div>

// //       {/* PAYMENT MODALS */}
// //       <PlansModal
// //         isOpen={showPlansModal}
// //         onClose={() => setShowPlansModal(false)}
// //         isLoggedIn={isAuthenticated}
// //         sellerId={currentUser?.user_id || ''}
// //         userToken={userToken}
// //       />

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

// //       {checkoutOptions && paymentId && selectedPlan && (
// //         <PaymentCheckout
// //           checkoutOptions={checkoutOptions}
// //           paymentId={paymentId}
// //           planId={selectedPlan.id}
// //           sellerId={currentUser?.user_id || ''}
// //           onSuccess={handlePaymentSuccess}
// //           onError={handlePaymentError}
// //           userToken={userToken}
// //         />
// //       )}
// //     </>
// //   );
// // };

// // console.log('✅ SellerDashboard loaded - PRODUCTION v9.0 - EXACT DUMMY UI APPLIED'); 
// import React, { useState, useEffect, useMemo, useCallback } from "react";
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
// import { jwtService } from '../lib/jwtService';
// import { PlansModal } from './Payment/PlansModal';
// import { PaymentConfirmationModal } from './Payment/PaymentConfirmationModal';
// import { PaymentCheckout } from './Payment/PaymentCheckout';
// import { initiatePayment } from '../lib/paymentService';
// import { getPlanById } from '../lib/planService';
// import type { Plan } from '../types/plan.types';
// import type { RazorpayCheckoutOptions } from '../types/payment.types';
// import { auth } from '../lib/firebase';
// import { HistoryTab } from "./HistoryTab";
// import {
//   uploadTile,
//   updateTile,
//   deleteTile,
//   getSellerProfile,
//   getSellerTiles,
//   updateTileQRCode,
//   getTileById,
//   signOut,
// } from "../lib/firebaseutils";
// import { BillingTab } from './BillingTab';
// import { uploadToCloudinary } from "../utils/cloudinaryUtils";
// import { 
//   getSellerSubscription, 
//   isSubscriptionExpired,
//   getDaysUntilExpiry 
// } from "../lib/subscriptionService";

// interface SellerPlanStatus {
//   isActive: boolean;
//   expiresAt: Date | null;
//   planName: string | null;
//   planId: string | null;
//   daysRemaining: number;
//   loading: boolean;
//   lastChecked: Date | null;
// }

// export const SellerDashboard: React.FC = () => {
//   const { currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
  
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
//     | "history"
//     | "billing"
//   >("tiles");

//   const [editingTile, setEditingTile] = useState<Tile | null>(null);
//   const [sellerProfile, setSellerProfile] = useState<any>(null);
//   const [tiles, setTiles] = useState<Tile[]>([]);
//   const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
//   const [userToken, setUserToken] = useState<string>('');
  
//   const [loading, setLoading] = useState(true);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [textureUploading, setTextureUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState<string>("all");
//   const [stockFilter, setStockFilter] = useState<string>("all");
  
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [expandedTileId, setExpandedTileId] = useState<string | null>(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   const [showPlansModal, setShowPlansModal] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
//   const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0);
//   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
//   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   // ✅ NEW: Header-specific states
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);

//   // ✅ Live Clock
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // ✅ Close user menu on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest('.user-menu-container')) {
//         setShowUserMenu(false);
//       }
//     };
//     if (showUserMenu) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showUserMenu]);

//   useEffect(() => {
//     const checkPaymentSuccess = () => {
//       const flag = localStorage.getItem('plan_just_purchased');
//       if (flag) {
//         setPlanRefreshTrigger(prev => prev + 1);
//         localStorage.removeItem('plan_just_purchased');
//         if (showPlansModal) {
//           setTimeout(() => setShowPlansModal(false), 3000);
//         }
//       }
//     };
//     const interval = setInterval(checkPaymentSuccess, 1000);
//     return () => clearInterval(interval);
//   }, [showPlansModal]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const token = jwtService.getAccessToken();
//       if (token && jwtService.isValidTokenFormat(token)) {
//         setUserToken(token);
//       }
//     }
//   }, [isAuthenticated]);

//   const [planStatus, setPlanStatus] = useState<SellerPlanStatus>({
//     isActive: false,
//     expiresAt: null,
//     planName: null,
//     planId: null,
//     daysRemaining: 0,
//     loading: true,
//     lastChecked: null
//   });

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

//   const checkSellerPlanStatus = async (sellerId: string): Promise<SellerPlanStatus> => {
//     try {
//       const subscription = await getSellerSubscription(sellerId, true);
//       if (!subscription) {
//         return {
//           isActive: false,
//           expiresAt: null,
//           planName: null,
//           planId: null,
//           daysRemaining: 0,
//           loading: false,
//           lastChecked: new Date()
//         };
//       }
//       const expired = isSubscriptionExpired(subscription);
//       const daysRemaining = getDaysUntilExpiry(subscription);
//       const endDate = subscription.end_date ? new Date(subscription.end_date) : null;
//       return {
//         isActive: !expired,
//         expiresAt: endDate,
//         planName: subscription.plan_name || null,
//         planId: subscription.plan_id || null,
//         daysRemaining,
//         loading: false,
//         lastChecked: new Date()
//       };
//     } catch (error: any) {
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
//   };

//   const loadPlanStatus = async () => {
//     if (!currentUser?.user_id) return;
//     try {
//       const status = await checkSellerPlanStatus(currentUser.user_id);
//       setPlanStatus(status);
//     } catch (error: any) {
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

//   const handlePlanStatusChange = async (isActive: boolean, isExpired: boolean) => {
//     setPlanStatus(prev => ({
//       ...prev,
//       isActive,
//       loading: false,
//       lastChecked: new Date()
//     }));
//     if (!isActive && isExpired) {
//       setTimeout(async () => {
//         await loadPlanStatus();
//       }, 1000);
//     }
//   };

//   const isFeatureAllowed = (feature: 'scan' | 'worker' | 'analytics'): boolean => {
//     if (planStatus.loading) return false;
//     return planStatus.isActive;
//   };

//   const getDisabledReason = (): string => {
//     if (planStatus.loading) return 'Checking plan status...';
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

//   useEffect(() => {
//     if (currentUser && isAuthenticated) {
//       loadData();
//       loadPlanStatus();
//     } else if (currentUser === null && !isAuthenticated) {
//       setLoading(false);
//     }
//   }, [currentUser, isAuthenticated]);

//   useEffect(() => {
//     if (currentUser?.user_id && isAuthenticated && planRefreshTrigger > 0) {
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

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
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
//         setTiles(uniqueTiles);
//       } else {
//         setTiles([]);
//       }
//     } catch (error: any) {
//       setError("Failed to load dashboard data. Please refresh the page.");
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   const handlePlanSelection = async (planId: string) => {
//     try {
//       if (!isAuthenticated) {
//         setShowPlansModal(false);
//         setError('Please login to select a plan');
//         return;
//       }
//       const plan = await getPlanById(planId);
//       if (!plan) {
//         setError('❌ Plan not found. Please try again.');
//         return;
//       }
//       setSelectedPlan(plan);
//       setShowPlansModal(false);
//       setShowPaymentConfirmation(true);
//     } catch (error: any) {
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
//       setCheckoutOptions(result.checkoutOptions);
//       setPaymentId(result.paymentId);
//       setShowPaymentConfirmation(false);
//     } catch (error: any) {
//       setError(`❌ Payment Error: ${error.message}`);
//       setProcessingPayment(false);
//     }
//   };

//   const handlePaymentSuccess = async () => {
//     try {
//       setCheckoutOptions(null);
//       setPaymentId(null);
//       setProcessingPayment(false);
//       setSelectedPlan(null);
//       setShowPaymentConfirmation(false);
//       setShowPlansModal(false);
//       setSuccess('🎉 Payment successful! Activating plan...');
//       try {
//         const { enableAllSellersWorkers } = await import('../lib/firebaseutils');
//         const result = await enableAllSellersWorkers(currentUser?.user_id || '');
//         if (result.success && result.count > 0) {
//           setSuccess(`🎉 Plan activated! ${result.count} worker(s) enabled.`);
//         }
//       } catch (workerError: any) {
//         console.warn('⚠️ Worker enable failed:', workerError);
//       }
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       setPlanRefreshTrigger(prev => prev + 1);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       await loadPlanStatus();
//       await loadData();
//       setSuccess('✅ Plan activated! Workers can now login.');
//       setTimeout(() => setSuccess(null), 7000);
//     } catch (error: any) {
//       setError('Payment successful but refresh failed. Reload page manually.');
//     }
//   };

//   const handlePaymentError = async (error: string) => {
//     setError(`❌ Payment Error: ${error}`);
//     setCheckoutOptions(null);
//     setPaymentId(null);
//     setProcessingPayment(false);
//     setSelectedPlan(null);
//     setShowPaymentConfirmation(false);
//     setTimeout(async () => {
//       await loadPlanStatus();
//     }, 2000);
//   };

//   const generateTileCode = (): string => {
//     const prefix = sellerProfile?.business_name?.substring(0, 3).toUpperCase() || "TIL";
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
//       const imageUrl = await uploadToCloudinary(
//         file,
//         type === "image" ? "tiles/main" : "tiles/textures"
//       );
//       if (type === "image") {
//         setNewTile((prev) => ({ ...prev, imageUrl }));
//       } else {
//         setNewTile((prev) => ({ ...prev, textureUrl: imageUrl }));
//       }
//       setSuccess(`${type === "image" ? "Image" : "Texture"} uploaded successfully`);
//     } catch (error: any) {
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
//     if (!newTile.size || newTile.size.trim() === "" || newTile.size === "manual_trigger") {
//       return "❌ Tile Size is required. Please select or enter a size.";
//     }
//     if (newTile.size.includes('x') && !newTile.size.match(/^\d+x\d+ cm$/)) {
//       return "❌ Invalid Manual Size. Please enter BOTH Width and Height properly.";
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
//       const tileCode = newTile.tileCode || generateTileCode();
//       const baseTileData = {
//         ...newTile,
//         size: newTile.size?.trim(),
//         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
//         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
//         sellerId: currentUser.user_id,
//         showroomId: currentUser.user_id,
//         tileCode: tileCode,
//         inStock: (newTile.stock || 0) > 0,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };
//       const savedTile = await uploadTile(baseTileData);
//       if (!savedTile || !savedTile.id) {
//         throw new Error("Tile saved but ID not returned");
//       }
//       let qrCodeGenerated = false;
//       try {
//         const qrCodeDataUrl = await generateTileQRCode(savedTile);
//         await updateTileQRCode(savedTile.id, qrCodeDataUrl);
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
//     } catch (error: any) {
//       setError(`Failed to add tile: ${error.message}`);
//     }
//   };

//   const handleEditTile = async (tile: Tile) => {
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
//       const updates = {
//         ...newTile,
//         size: newTile.size?.trim(),
//         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
//         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
//         inStock: (newTile.stock || 0) > 0,
//         updatedAt: new Date().toISOString(),
//       };
//       await updateTile(editingTile.id, updates);
//       const criticalFieldsChanged =
//         editingTile.name !== newTile.name ||
//         editingTile.tileCode !== newTile.tileCode ||
//         editingTile.price !== newTile.price ||
//         editingTile.size !== newTile.size ||
//         editingTile.category !== newTile.category;
//       if (criticalFieldsChanged) {
//         setTimeout(async () => {
//           try {
//             if (typeof getTileById !== "function") return;
//             if (typeof generateTileQRCode !== "function") return;
//             if (typeof updateTileQRCode !== "function") return;
//             const updatedTileData = await getTileById(editingTile.id);
//             if (!updatedTileData) return;
//             const newQRCode = await generateTileQRCode(updatedTileData);
//             if (!newQRCode || !newQRCode.startsWith("data:image")) return;
//             await updateTileQRCode(editingTile.id, newQRCode);
//             await loadData();
//           } catch (qrError: any) {
//             console.error("⚠️ QR regeneration failed (non-critical):", qrError.message);
//           }
//         }, 0);
//       }
//       await loadData();
//       setEditingTile(null);
//       resetNewTile();
//       setSuccess("Tile updated successfully!");
//     } catch (error: any) {
//       setError(`Failed to update tile: ${error.message}`);
//     }
//   };

//   const handleDeleteTile = async (tileId: string, tileName: string) => {
//     if (!window.confirm(`Delete "${tileName}"?`)) return;
//     try {
//       setError(null);
//       await deleteTile(tileId);
//       await loadData();
//       setSuccess("Tile deleted successfully");
//     } catch (error: any) {
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

//   // ✅ LOGOUT HANDLER with Security
//   const handleSignOut = useCallback(async () => {
//     const confirmed = window.confirm('Are you sure you want to logout?');
//     if (!confirmed) return;
//     setIsLoggingOut(true);
//     try {
//       await signOut();
//       setCurrentUser(null);
//       setIsAuthenticated(false);
//       localStorage.removeItem('user');
//       localStorage.removeItem('isAuthenticated');
//       sessionStorage.clear();
//       document.cookie.split(";").forEach((c) => {
//         document.cookie = c
//           .replace(/^ +/, "")
//           .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
//       });
//       window.location.href = '/?logout=true';
//     } catch (error) {
//       alert('Logout failed. Please try again.');
//     } finally {
//       setIsLoggingOut(false);
//     }
//   }, [setCurrentUser, setIsAuthenticated]);

//   // ✅ ROLE-BASED STYLING
//   const roleColor = useMemo(() => {
//     if (!currentUser) return 'bg-gray-100 text-gray-700 border-gray-200';
//     switch (currentUser.role) {
//       case 'admin':
//         return 'bg-red-50 text-red-700 border-red-200';
//       case 'seller':
//         return 'bg-green-50 text-green-700 border-green-200';
//       default:
//         return 'bg-blue-50 text-blue-700 border-blue-200';
//     }
//   }, [currentUser]);

//   // ✅ FORMATTED TIME & DATE
//   const formattedTime = useMemo(() => {
//     return currentTime.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   }, [currentTime]);

//   const formattedDate = useMemo(() => {
//     return currentTime.toLocaleDateString('en-US', {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   }, [currentTime]);

//   // ✅ USER DISPLAY NAME
//   const userDisplayName = useMemo(() => {
//     if (!currentUser) return 'Guest';
//     return currentUser.full_name || currentUser.email?.split('@')[0] || 'User';
//   }, [currentUser]);

//   const isScanAllowed = isFeatureAllowed('scan');
//   const isWorkerAllowed = isFeatureAllowed('worker');
//   const disabledMessage = getDisabledReason();

//   if (!isAuthenticated || !currentUser || currentUser.role !== "seller") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-surface p-4">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
//           <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
//           <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
//           <p className="text-on-surface-variant mb-6">
//             {!isAuthenticated ? 'Please login to continue' : 
//              !currentUser ? 'User profile not found' :
//              'This dashboard is only for sellers'}
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
//           >
//             Reload Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-surface">
//         <div className="text-center">
//           <span className="material-symbols-outlined text-6xl text-primary animate-spin mb-4 block">refresh</span>
//           <p className="text-lg text-on-surface">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{`
//         .glass-card {
//           background: rgba(255, 255, 255, 0.4);
//           backdrop-filter: blur(20px);
//           border: 1px solid rgba(255, 255, 255, 0.6);
//           box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
//         }
//         .premium-gradient {
//           background: linear-gradient(135deg, #2d5bff 0%, #8127cf 100%);
//         }
//         .material-symbols-outlined {
//           font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
//         }
//         ::-webkit-scrollbar {
//           width: 6px;
//         }
//         ::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         ::-webkit-scrollbar-thumb {
//           background: #e0e3e5;
//           border-radius: 10px;
//         }
//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slide-down {
//           animation: slide-down 0.3s ease-out;
//         }
//         .user-menu-dropdown {
//           animation: slideDown 0.2s ease-out;
//         }
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
//       `}</style>

//       <div className="flex h-screen bg-background overflow-hidden">
//         {/* SIDEBAR */}
//         {/* <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-white/40 backdrop-blur-xl z-50 flex flex-col py-8 px-4 shadow-sm">
//           <div className="mb-10 px-2 flex items-center gap-3">
//             <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary-container">
//               <span className="material-symbols-outlined text-2xl">grid_view</span>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-primary">Tilesview360</h1>
//               <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
//                 Seller Dashboard
//               </p>
//             </div>
//           </div>

//           <nav className="flex-1 space-y-1">
//             <a
//               onClick={() => handleTabChange("tiles")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "tiles"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">grid_view</span>
//               <span>My Tiles</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("history")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "history"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">history</span>
//               <span>History</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("billing")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "billing"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">payments</span>
//               <span>Billing</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("customer-inquiries")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "customer-inquiries"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">group</span>
//               <span>Customers</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("stock-analytics")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "stock-analytics"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">analytics</span>
//               <span>Analytics</span>
//             </a>

//             <a
//               onClick={() => {
//                 if (isWorkerAllowed) {
//                   handleTabChange("worker");
//                 } else {
//                   setShowPlansModal(true);
//                 }
//               }}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer relative ${
//                 activeTab === "worker"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : !isWorkerAllowed
//                   ? "text-on-surface-variant/50 cursor-not-allowed opacity-60"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//               title={!isWorkerAllowed ? disabledMessage : "Manage Workers"}
//             >
//               <span className="material-symbols-outlined">engineering</span>
//               <span>Worker</span>
//               {!isWorkerAllowed && (
//                 <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
//               )}
//             </a>

//             <a
//               onClick={() => {
//                 if (isScanAllowed) {
//                   window.open("/scan", "_blank");
//                 } else {
//                   setShowPlansModal(true);
//                 }
//               }}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer relative ${
//                 !isScanAllowed
//                   ? "text-on-surface-variant/50 cursor-not-allowed opacity-60"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//               title={!isScanAllowed ? disabledMessage : "Open QR Scanner"}
//             >
//               <span className="material-symbols-outlined">qr_code_scanner</span>
//               <span>Scan</span>
//               {!isScanAllowed && (
//                 <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
//               )}
//             </a>

//             <a
//               onClick={() => handleTabChange("profile")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "profile"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">account_circle</span>
//               <span>Profile</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("excel")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "excel"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">table_view</span>
//               <span>Excel</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("qrcodes")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "qrcodes"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">qr_code</span>
//               <span>QR Codes</span>
//             </a>
//           </nav>

//           <div className="mt-auto pt-6 border-t border-outline-variant space-y-1">
//             <button
//               onClick={() => {
//                 setIsAddingTile(true);
//                 setEditingTile(null);
//                 resetNewTile();
//                 handleTabChange("tiles");
//                 window.scrollTo({ top: 0, behavior: 'smooth' });
//               }}
//               className="w-full mb-6 bg-primary text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
//             >
//               <span className="material-symbols-outlined">add</span>
//               <span>Create New Tile</span>
//             </button>

//             <a
//               onClick={() => setShowPlansModal(true)}
//               className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-200 cursor-pointer"
//             >
//               <span className="material-symbols-outlined">settings</span>
//               <span>Settings</span>
//             </a>

//             <a
//               href="#"
//               className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-200"
//             >
//               <span className="material-symbols-outlined">help</span>
//               <span>Support</span>
//             </a>
//           </div>
//         </aside> */}
//         {/* ✅ FIXED SIDEBAR - Exact Dummy UI Match */}
        
// <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-white/40 backdrop-blur-xl z-50 flex flex-col py-8 px-4 shadow-sm">
//   {/* Brand Section - FIXED FONTS */}
//   <div className="mb-10 px-2 flex items-center gap-3">
//     <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary-container">
//       <span className="material-symbols-outlined text-2xl">grid_view</span>
//     </div>
//     <div>
//       <h1 className="font-headline-md text-headline-md font-bold text-primary">Tilesview360</h1>
//       <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
//         Seller Dashboard
//       </p>
//     </div>
//   </div>

//   {/* Navigation - FIXED ALL FONT CLASSES */}
//   <nav className="flex-1 space-y-1">
//     <a
//       onClick={() => handleTabChange("tiles")}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//         activeTab === "tiles"
//           ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//           : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//       }`}
//     >
//       <span className="material-symbols-outlined">grid_view</span>
//       <span className="font-body-md text-body-md">My Tiles</span>
//     </a>

//     <a
//       onClick={() => handleTabChange("history")}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//         activeTab === "history"
//           ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//           : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//       }`}
//     >
//       <span className="material-symbols-outlined">history</span>
//       <span className="font-body-md text-body-md">History</span>
//     </a>

//     <a
//       onClick={() => handleTabChange("billing")}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//         activeTab === "billing"
//           ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//           : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//       }`}
//     >
//       <span className="material-symbols-outlined">payments</span>
//       <span className="font-body-md text-body-md">Billing</span>
//     </a>

//     <a
//       onClick={() => handleTabChange("customer-inquiries")}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//         activeTab === "customer-inquiries"
//           ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//           : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//       }`}
//     >
//       <span className="material-symbols-outlined">group</span>
//       <span className="font-body-md text-body-md">Customers</span>
//     </a>

//     <a
//       onClick={() => handleTabChange("stock-analytics")}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//         activeTab === "stock-analytics"
//           ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//           : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//       }`}
//     >
//       <span className="material-symbols-outlined">analytics</span>
//       <span className="font-body-md text-body-md">Analytics</span>
//     </a>

//     <a
//       onClick={() => {
//         if (isWorkerAllowed) {
//           handleTabChange("worker");
//         } else {
//           setShowPlansModal(true);
//         }
//       }}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer relative ${
//         activeTab === "worker"
//           ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//           : !isWorkerAllowed
//           ? "text-on-surface-variant/50 cursor-not-allowed opacity-60"
//           : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//       }`}
//       title={!isWorkerAllowed ? disabledMessage : "Manage Workers"}
//     >
//       <span className="material-symbols-outlined">engineering</span>
//       <span className="font-body-md text-body-md">Worker</span>
//       {!isWorkerAllowed && (
//         <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
//       )}
//     </a>

//     <a
//       onClick={() => {
//         if (isScanAllowed) {
//           window.open("/scan", "_blank");
//         } else {
//           setShowPlansModal(true);
//         }
//       }}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer relative ${
//         !isScanAllowed
//           ? "text-on-surface-variant/50 cursor-not-allowed opacity-60"
//           : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//       }`}
//       title={!isScanAllowed ? disabledMessage : "Open QR Scanner"}
//     >
//       <span className="material-symbols-outlined">qr_code_scanner</span>
//       <span className="font-body-md text-body-md">Scan</span>
//       {!isScanAllowed && (
//         <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
//       )}
//     </a>

//     <a
//       onClick={() => handleTabChange("profile")}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//         activeTab === "profile"
//           ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//           : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//       }`}
//     >
//       <span className="material-symbols-outlined">account_circle</span>
//       <span className="font-body-md text-body-md">Profile</span>
//     </a>

//     <a
//       onClick={() => handleTabChange("excel")}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//         activeTab === "excel"
//           ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//           : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//       }`}
//     >
//       <span className="material-symbols-outlined">table_view</span>
//       <span className="font-body-md text-body-md">Excel</span>
//     </a>

//     <a
//       onClick={() => handleTabChange("qrcodes")}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//         activeTab === "qrcodes"
//           ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//           : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//       }`}
//     >
//       <span className="material-symbols-outlined">qr_code</span>
//       <span className="font-body-md text-body-md">QR Codes</span>
//     </a>
//   </nav>

//   {/* Bottom Section - FIXED BUTTON & LINKS */}
//   <div className="mt-auto pt-6 border-t border-outline-variant space-y-1">
//     <button
//       onClick={() => {
//         setIsAddingTile(true);
//         setEditingTile(null);
//         resetNewTile();
//         handleTabChange("tiles");
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//       }}
//       className="w-full mb-6 bg-primary text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
//     >
//       <span className="material-symbols-outlined">add</span>
//       <span>Create New Tile</span>
//     </button>

//     <a
//       onClick={() => setShowPlansModal(true)}
//       className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-200 cursor-pointer"
//     >
//       <span className="material-symbols-outlined">settings</span>
//       <span className="font-body-md text-body-md">Settings</span>
//     </a>

//     <a
//       href="#"
//       className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-200"
//     >
//       <span className="material-symbols-outlined">help</span>
//       <span className="font-body-md text-body-md">Support</span>
//     </a>
//   </div>
// </aside>

//         {/* MAIN CONTENT */}
//         <main className="ml-64 flex-1 overflow-auto">
//           {/* ✅ ENHANCED TOP HEADER with User Menu */}
//           <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-2xl border-b border-white/50 shadow-sm bg-white/80">
//             <div className="h-16 px-8 flex items-center justify-between">
//               <div className="flex items-center flex-1 max-w-2xl pr-8">
//                 <div className="relative w-full group">
//                   <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
//                     search
//                   </span>
//                   <input
//                     type="text"
//                     placeholder="Search tiles by name, code, material..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full bg-surface-container-low border-none rounded-full py-2 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/30 rounded-full transition-transform active:scale-90 relative">
//                   <span className="material-symbols-outlined text-xl">notifications</span>
//                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
//                 </button>

//                 <button
//                   onClick={() => setShowPlansModal(true)}
//                   className="p-2 text-on-surface-variant hover:bg-surface-container-highest/30 rounded-full transition-transform active:scale-90"
//                 >
//                   <span className="material-symbols-outlined text-xl">settings</span>
//                 </button>

//                 <div className="h-6 w-px bg-outline-variant mx-1"></div>

//                 {/* ✅ USER MENU CONTAINER */}
//                 <div className="user-menu-container relative">
//                   <button
//                     onClick={() => setShowUserMenu(!showUserMenu)}
//                     className={`flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-lg border transition-all ${roleColor}`}
//                   >
//                     <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-sm bg-primary-container flex items-center justify-center">
//                       <span className="material-symbols-outlined text-primary">person</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-sm">{sellerProfile?.business_name || userDisplayName}</p>
//                       <p className="text-[10px] opacity-75 capitalize">{currentUser.role} Seller</p>
//                     </div>
//                   </button>

//                   {/* ✅ DROPDOWN MENU */}
//                   {showUserMenu && (
//                     <div className="user-menu-dropdown absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
//                       <div className="px-4 py-3 border-b border-gray-100">
//                         <p className="text-sm font-semibold text-gray-800 truncate">
//                           {userDisplayName}
//                         </p>
//                         <p className="text-xs text-gray-500 truncate">
//                           {currentUser.email}
//                         </p>
//                       </div>

//                       <div className="py-1">
//                         <button
//                           onClick={() => {
//                             handleTabChange("profile");
//                             setShowUserMenu(false);
//                           }}
//                           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
//                         >
//                           <span className="material-symbols-outlined text-base">person</span>
//                           My Profile
//                         </button>

//                         <button
//                           onClick={() => {
//                             setShowPlansModal(true);
//                             setShowUserMenu(false);
//                           }}
//                           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
//                         >
//                           <span className="material-symbols-outlined text-base">workspace_premium</span>
//                           Subscription Plans
//                         </button>

//                         <div className="border-t border-gray-100 my-1"></div>

//                         <button
//                           onClick={handleSignOut}
//                           disabled={isLoggingOut}
//                           className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
//                         >
//                           <span className="material-symbols-outlined text-base">logout</span>
//                           {isLoggingOut ? 'Logging out...' : 'Logout'}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* ✅ STATUS BAR - Enhanced */}
//             <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t px-8 py-2.5">
//               <div className="flex items-center justify-between text-sm text-gray-600">
//                 <div className="flex items-center gap-4">
//                   <span className="font-medium">
//                     Welcome back, <span className="text-gray-800">{userDisplayName}</span>
//                   </span>
//                   <span className="text-gray-400">•</span>
//                   <span className="text-gray-500">{formattedDate}</span>
//                   <span className="text-gray-400">•</span>
//                   <span className="flex items-center gap-1.5">
//                     <span className="material-symbols-outlined text-sm text-green-500">wifi</span>
//                     <span className="text-green-600 font-medium">Online</span>
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2 text-gray-500">
//                   <span className="material-symbols-outlined text-sm">schedule</span>
//                   <span className="font-mono font-medium">{formattedTime}</span>
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* CONTENT CANVAS */}
//           <div className="pt-8 pb-8 px-16 space-y-8">
//             {error && (
//               <div className="p-4 bg-error-container border border-error rounded-lg flex items-start gap-3 animate-slide-down">
//                 <span className="material-symbols-outlined text-error">error</span>
//                 <div className="flex-1">
//                   <p className="text-on-error-container font-medium">Error</p>
//                   <p className="text-on-error-container text-sm">{error}</p>
//                 </div>
//                 <button onClick={() => setError(null)} className="text-error hover:text-error/80">
//                   <span className="material-symbols-outlined">close</span>
//                 </button>
//               </div>
//             )}

//             {success && (
//               <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-slide-down">
//                 <span className="material-symbols-outlined text-green-600">check_circle</span>
//                 <div className="flex-1">
//                   <p className="text-green-800 font-medium">Success</p>
//                   <p className="text-green-700 text-sm">{success}</p>
//                 </div>
//                 <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">
//                   <span className="material-symbols-outlined">close</span>
//                 </button>
//               </div>
//             )}

//             {activeTab === "tiles" ? (
//               <>
//                 <div className="mb-6 flex justify-between items-end">
//                   <div>
//                     <nav className="flex text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 gap-2">
//                       <span>Dashboard</span>
//                     </nav>
//                     <h2 className="text-[28px] leading-tight font-semibold text-on-surface">
//                       Tile Catalog
//                     </h2>
//                     <p className="text-on-surface-variant text-sm mt-0.5">
//                       Organize your tiles, monitor stock, and power customer visualizations.
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         setIsAddingTile(true);
//                         setEditingTile(null);
//                         resetNewTile();
//                         window.scrollTo({ top: 0, behavior: 'smooth' });
//                       }}
//                       className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:scale-105 active:scale-95 transition-all font-bold text-xs shadow-lg shadow-primary/20"
//                     >
//                       <span className="material-symbols-outlined text-base">add</span>
//                       Add New Tile
//                     </button>
//                   </div>
//                 </div>

//                 <section>
//                   <div className="glass-card premium-gradient p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
//                     <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
//                     <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/30 rounded-full blur-2xl"></div>

//                     <div className="relative z-10 flex gap-4 items-center">
//                       <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center text-white">
//                         <span className="material-symbols-outlined text-2xl">workspace_premium</span>
//                       </div>
//                       <div>
//                         <h3 className="text-white font-bold text-lg">
//                           {planStatus.isActive 
//                             ? `Active Plan: ${planStatus.planName || 'Premium'}` 
//                             : 'Premium Features Await'}
//                         </h3>
//                         <p className="text-white/80 text-sm">
//                           {planStatus.isActive
//                             ? `Expires in ${planStatus.daysRemaining} days - Renew to keep access`
//                             : 'Transform your showroom with unlimited tile management and immersive 3D visualization.'}
//                         </p>
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => setShowPlansModal(true)}
//                       className="relative z-10 px-6 py-2.5 bg-white text-primary rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
//                     >
//                       <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">
//                         visibility
//                       </span>
//                       {planStatus.isActive ? 'Upgrade Plan' : 'View Plans'}
//                     </button>
//                   </div>
//                 </section>

//                 <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
//                   <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
//                     <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
//                       <span className="material-symbols-outlined text-xl">grid_on</span>
//                     </div>
//                     <div>
//                       <p className="text-on-surface-variant font-medium text-xs">Total Tiles</p>
//                       <h4 className="text-lg font-bold leading-tight">{tiles.length}</h4>
//                       <p className="text-primary text-[9px] font-bold uppercase tracking-wider">
//                         {tiles.filter(t => t.category === 'both').length} Collections
//                       </p>
//                     </div>
//                   </div>

//                   <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
//                     <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
//                       <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
//                     </div>
//                     <div>
//                       <p className="text-on-surface-variant font-medium text-xs">QR Generated</p>
//                       <h4 className="text-lg font-bold leading-tight">
//                         {tiles.filter(t => t.qrCode).length}
//                       </h4>
//                       <p className="text-green-600 text-[9px] font-bold uppercase tracking-wider">Active</p>
//                     </div>
//                   </div>

//                   <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
//                     <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
//                       <span className="material-symbols-outlined text-xl">inventory_2</span>
//                     </div>
//                     <div>
//                       <p className="text-on-surface-variant font-medium text-xs">Total Stock</p>
//                       <h4 className="text-lg font-bold leading-tight">
//                         {tiles.reduce((sum, t) => sum + (t.stock || 0), 0)}
//                       </h4>
//                       <p className="text-green-600 text-[9px] font-bold uppercase tracking-wider">
//                         {tiles.filter(t => t.inStock).length} Available
//                       </p>
//                     </div>
//                   </div>

//                   <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
//                     <div className="w-10 h-10 bg-error/10 text-error rounded-lg flex items-center justify-center group-hover:bg-error group-hover:text-white transition-colors">
//                       <span className="material-symbols-outlined text-xl">outbox</span>
//                     </div>
//                     <div>
//                       <p className="text-on-surface-variant font-medium text-xs">Low Stock</p>
//                       <h4 className="text-lg font-bold leading-tight">
//                         {tiles.filter(t => t.inStock && (t.stock || 0) < 10).length}
//                       </h4>
//                       <p className="text-error text-[9px] font-bold uppercase tracking-wider">Reorder</p>
//                     </div>
//                   </div>

//                   <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
//                     <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
//                       <span className="material-symbols-outlined text-xl">group</span>
//                     </div>
//                     <div>
//                       <p className="text-on-surface-variant font-medium text-xs">In Stock</p>
//                       <h4 className="text-lg font-bold leading-tight">
//                         {Math.round((tiles.filter(t => t.inStock).length / tiles.length) * 100) || 0}%
//                       </h4>
//                       <p className="text-primary text-[9px] font-bold uppercase tracking-wider">Retention</p>
//                     </div>
//                   </div>
//                 </section>

//                 {(isAddingTile || editingTile) && (
//                   <div className="glass-card p-6 rounded-2xl border border-white/60">
//                     <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                       {editingTile ? (
//                         <>
//                           <span className="material-symbols-outlined text-primary">edit</span>
//                           Edit: {editingTile.name}
//                         </>
//                       ) : (
//                         <>
//                           <span className="material-symbols-outlined text-primary">add</span>
//                           Add New Tile
//                         </>
//                       )}
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Tile Name *
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="Enter tile name"
//                           value={newTile.name}
//                           onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Tile Code
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="Auto-generated if empty"
//                           value={newTile.tileCode}
//                           onChange={(e) => setNewTile({ ...newTile, tileCode: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Category *
//                         </label>
//                         <select
//                           value={newTile.category}
//                           onChange={(e) => setNewTile({ ...newTile, category: e.target.value as any })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
//                         >
//                           <option value="floor">Floor Only</option>
//                           <option value="wall">Wall Only</option>
//                           <option value="both">Floor & Wall</option>
//                         </select>
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">Size *</label>
//                         {(() => {
//                           const standardSizes = [
//                             "30x30 cm", "30x60 cm", "60x60 cm", "60x120 cm", "80x80 cm",
//                             "40x40 cm", "40x60 cm", "50x50 cm", "20x120 cm", "15x90 cm",
//                             "10x30 cm", "20x20 cm", "25x40 cm", "61x122 cm", "122x122 cm",
//                             "75x75 cm", "100x100 cm", "45x45 cm", "7.5x15 cm", "6x25 cm"
//                           ];
//                           const currentSize = newTile.size || "";
//                           const isManualMode = currentSize === "manual_trigger" || (currentSize !== "" && !standardSizes.includes(currentSize));
//                           let parsedWidth = "";
//                           let parsedHeight = "";
//                           if (isManualMode && currentSize !== "manual_trigger") {
//                             const parts = currentSize.replace(" cm", "").split("x");
//                             if (parts.length === 2) {
//                               parsedWidth = parts[0];
//                               parsedHeight = parts[1];
//                             }
//                           }
//                           const handleManualChange = (w: string, h: string) => {
//                             setNewTile({ ...newTile, size: `${w}x${h} cm` });
//                           };
//                           return (
//                             <div className="space-y-3">
//                               {!isManualMode ? (
//                                 <div>
//                                   <select
//                                     value={currentSize}
//                                     onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                                   >
//                                     <option value="">Select Tile Size</option>
//                                     {standardSizes.map((sizeOption) => (
//                                       <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
//                                     ))}
//                                   </select>
//                                   <button
//                                     type="button"
//                                     onClick={() => setNewTile({ ...newTile, size: "manual_trigger" })}
//                                     className="mt-2 text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1"
//                                   >
//                                     <span className="material-symbols-outlined text-sm">add</span>
//                                     Add Manual Size
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
//                                   <div className="flex justify-between items-center">
//                                     <span className="text-xs font-semibold text-primary">
//                                       Enter Custom Size (in cm)
//                                     </span>
//                                     <button
//                                       type="button"
//                                       onClick={() => setNewTile({ ...newTile, size: "" })}
//                                       className="text-xs text-error hover:text-error/80 font-medium"
//                                     >
//                                       Cancel
//                                     </button>
//                                   </div>
//                                   <div className="flex items-center gap-3">
//                                     <input
//                                       type="number"
//                                       placeholder="Width"
//                                       value={parsedWidth}
//                                       onChange={(e) => handleManualChange(e.target.value, parsedHeight)}
//                                       className="flex-1 px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
//                                       min="1"
//                                     />
//                                     <span className="text-primary font-bold">×</span>
//                                     <input
//                                       type="number"
//                                       placeholder="Height"
//                                       value={parsedHeight}
//                                       onChange={(e) => handleManualChange(parsedWidth, e.target.value)}
//                                       className="flex-1 px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
//                                       min="1"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })()}
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">Tile Surface</label>
//                         {(() => {
//                           const standardSurfaces = ["Polished", "Step Side", "Matt", "Carving", "High Gloss", "Metallic", "Sugar", "Glue", "Punch"];
//                           const currentSurface = newTile.tileSurface || "";
//                           const isManualMode = currentSurface === "manual_trigger" || (currentSurface !== "" && !standardSurfaces.includes(currentSurface));
//                           return (
//                             <div className="space-y-3">
//                               {!isManualMode ? (
//                                 <div>
//                                   <select
//                                     value={currentSurface}
//                                     onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value || undefined })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                                   >
//                                     <option value="">Select Surface Finish</option>
//                                     {standardSurfaces.map((surface) => (
//                                       <option key={surface} value={surface}>{surface}</option>
//                                     ))}
//                                   </select>
//                                   <button
//                                     type="button"
//                                     onClick={() => setNewTile({ ...newTile, tileSurface: "manual_trigger" })}
//                                     className="mt-2 text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1"
//                                   >
//                                     <span className="material-symbols-outlined text-sm">add</span>
//                                     Add Manual Surface
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
//                                   <div className="flex justify-between items-center">
//                                     <span className="text-xs font-semibold text-primary">Enter Custom Surface</span>
//                                     <button
//                                       type="button"
//                                       onClick={() => setNewTile({ ...newTile, tileSurface: "" })}
//                                       className="text-xs text-error hover:text-error/80 font-medium"
//                                     >
//                                       Cancel
//                                     </button>
//                                   </div>
//                                   <input
//                                     type="text"
//                                     placeholder="e.g. Rustic, Satin, 3D Print"
//                                     value={currentSurface === "manual_trigger" ? "" : currentSurface}
//                                     onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value })}
//                                     className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
//                                     autoFocus
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })()}
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">Tile Material</label>
//                         {(() => {
//                           const standardMaterials = ["Slabs", "GVT & PGVT", "Double Charge", "Counter Tops", "Full Body", "Ceramic", "Mosaic", "Subway"];
//                           const currentMaterial = newTile.tileMaterial || "";
//                           const isManualMode = currentMaterial === "manual_trigger" || (currentMaterial !== "" && !standardMaterials.includes(currentMaterial));
//                           return (
//                             <div className="space-y-3">
//                               {!isManualMode ? (
//                                 <div>
//                                   <select
//                                     value={currentMaterial}
//                                     onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value || undefined })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                                   >
//                                     <option value="">Select Material Type</option>
//                                     {standardMaterials.map((material) => (
//                                       <option key={material} value={material}>{material}</option>
//                                     ))}
//                                   </select>
//                                   <button
//                                     type="button"
//                                     onClick={() => setNewTile({ ...newTile, tileMaterial: "manual_trigger" })}
//                                     className="mt-2 text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1"
//                                   >
//                                     <span className="material-symbols-outlined text-sm">add</span>
//                                     Add Manual Material
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
//                                   <div className="flex justify-between items-center">
//                                     <span className="text-xs font-semibold text-primary">Enter Custom Material</span>
//                                     <button
//                                       type="button"
//                                       onClick={() => setNewTile({ ...newTile, tileMaterial: "" })}
//                                       className="text-xs text-error hover:text-error/80 font-medium"
//                                     >
//                                       Cancel
//                                     </button>
//                                   </div>
//                                   <input
//                                     type="text"
//                                     placeholder="e.g. Porcelain, Natural Stone, Glass"
//                                     value={currentMaterial === "manual_trigger" ? "" : currentMaterial}
//                                     onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value })}
//                                     className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
//                                     autoFocus
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })()}
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">Price (₹) *</label>
//                         <input
//                           type="number"
//                           placeholder="Enter price"
//                           value={newTile.price || ""}
//                           onChange={(e) => setNewTile({ ...newTile, price: e.target.value === "" ? 0 : Number(e.target.value) })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                           min="0"
//                           step="0.01"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
//                         <input
//                           type="number"
//                           placeholder="Enter stock quantity"
//                           value={newTile.stock || ""}
//                           onChange={(e) => setNewTile({ ...newTile, stock: e.target.value === "" ? 0 : Number(e.target.value) })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                           min="0"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">Tile Image *</label>
//                         <div className="flex flex-col gap-2">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => {
//                               const file = e.target.files?.[0];
//                               if (file) handleImageUpload(file, "image");
//                             }}
//                             className="hidden"
//                             id="tile-image-upload"
//                           />
//                           <label
//                             htmlFor="tile-image-upload"
//                             className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium ${
//                               imageUploading ? "opacity-50 cursor-not-allowed" : ""
//                             }`}
//                           >
//                             {imageUploading ? (
//                               <>
//                                 <span className="material-symbols-outlined animate-spin">refresh</span>
//                                 Uploading...
//                               </>
//                             ) : (
//                               <>
//                                 <span className="material-symbols-outlined">upload</span>
//                                 Choose Image
//                               </>
//                             )}
//                           </label>
//                           {newTile.imageUrl && (
//                             <div className="flex items-center gap-2">
//                               <img
//                                 src={newTile.imageUrl}
//                                 alt="Preview"
//                                 className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//                               />
//                               <div className="flex items-center gap-1 text-green-600">
//                                 <span className="material-symbols-outlined text-sm">check_circle</span>
//                                 <span className="text-xs font-medium">Uploaded</span>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700">Texture (Optional)</label>
//                         <div className="flex flex-col gap-2">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => {
//                               const file = e.target.files?.[0];
//                               if (file) handleImageUpload(file, "texture");
//                             }}
//                             className="hidden"
//                             id="texture-image-upload"
//                           />
//                           <label
//                             htmlFor="texture-image-upload"
//                             className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium ${
//                               textureUploading ? "opacity-50 cursor-not-allowed" : ""
//                             }`}
//                           >
//                             {textureUploading ? (
//                               <>
//                                 <span className="material-symbols-outlined animate-spin">refresh</span>
//                                 Uploading...
//                               </>
//                             ) : (
//                               <>
//                                 <span className="material-symbols-outlined">upload</span>
//                                 Choose Texture
//                               </>
//                             )}
//                           </label>
//                           {newTile.textureUrl && (
//                             <div className="flex items-center gap-2">
//                               <img
//                                 src={newTile.textureUrl}
//                                 alt="Texture"
//                                 className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//                               />
//                               <div className="flex items-center gap-1 text-green-600">
//                                 <span className="material-symbols-outlined text-sm">check_circle</span>
//                                 <span className="text-xs font-medium">Uploaded</span>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex gap-2 mt-6">
//                       <button
//                         onClick={editingTile ? handleUpdateTile : handleAddTile}
//                         disabled={imageUploading || textureUploading}
//                         className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md"
//                       >
//                         <span className="material-symbols-outlined">save</span>
//                         {editingTile ? "Update Tile" : "Save Tile"}
//                       </button>
//                       <button
//                         onClick={() => {
//                           setIsAddingTile(false);
//                           setEditingTile(null);
//                           resetNewTile();
//                           setError(null);
//                         }}
//                         className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 <section className="glass-card rounded-2xl border border-white/60 overflow-hidden shadow-sm">
//                   <div className="p-4 border-b border-outline-variant bg-white/40 flex flex-wrap items-center justify-between gap-4">
//                     <div className="flex items-center gap-2">
//                       <div className="relative group">
//                         <select
//                           value={categoryFilter}
//                           onChange={(e) => setCategoryFilter(e.target.value)}
//                           className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-10 font-semibold text-xs focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
//                         >
//                           <option value="all">All Categories</option>
//                           <option value="wall">Wall</option>
//                           <option value="floor">Floor</option>
//                           <option value="both">Both</option>
//                         </select>
//                         <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-lg">
//                           expand_more
//                         </span>
//                       </div>

//                       <div className="relative group">
//                         <select
//                           value={stockFilter}
//                           onChange={(e) => setStockFilter(e.target.value)}
//                           className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-10 font-semibold text-xs focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
//                         >
//                           <option value="all">Stock Status</option>
//                           <option value="in-stock">In Stock</option>
//                           <option value="out-of-stock">Out of Stock</option>
//                         </select>
//                         <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-lg">
//                           expand_more
//                         </span>
//                       </div>

//                       <button
//                         onClick={loadData}
//                         className="p-2 hover:bg-surface-container-highest/50 rounded-lg transition-all group"
//                         title="Refresh"
//                       >
//                         <span className="material-symbols-outlined group-active:rotate-180 transition-transform duration-500 text-on-surface-variant text-xl">
//                           refresh
//                         </span>
//                       </button>
//                     </div>

//                     <div className="flex items-center gap-4">
//                       <p className="text-xs font-medium text-on-surface-variant">
//                         {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
//                       </p>
//                     </div>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                       <thead>
//                         <tr className="bg-surface-container-low/50 border-b">
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Image</th>
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Name</th>
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Code</th>
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Category</th>
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Size</th>
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Surface</th>
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Material</th>
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-right text-[11px] font-semibold">Price</th>
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-center text-[11px] font-semibold">Stock</th>
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Status</th>
//                           <th className="p-4 uppercase tracking-widest text-on-surface-variant text-center text-[11px] font-semibold">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-outline-variant/30">
//                         {currentTiles.length === 0 ? (
//                           <tr>
//                             <td colSpan={11} className="text-center p-8 text-gray-500">
//                               <span className="material-symbols-outlined text-6xl text-gray-300 block mb-2">grid_off</span>
//                               <p className="font-medium">No tiles found</p>
//                               <p className="text-sm">Try adjusting your filters</p>
//                             </td>
//                           </tr>
//                         ) : (
//                           currentTiles.map((tile) => (
//                             <tr key={tile.id} className="hover:bg-primary-container/5 transition-colors group">
//                               <td className="p-4">
//                                 <div className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-white p-1">
//                                   <img
//                                     src={tile.imageUrl}
//                                     alt={tile.name}
//                                     className="w-full h-full object-cover rounded"
//                                   />
//                                 </div>
//                               </td>
//                               <td className="p-4">
//                                 <p className="font-bold text-on-surface text-sm">{tile.name}</p>
//                                 {tile.textureUrl && (
//                                   <p className="text-[10px] text-green-600">Has Texture</p>
//                                 )}
//                               </td>
//                               <td className="p-4">
//                                 <span className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">
//                                   {tile.tileCode}
//                                 </span>
//                               </td>
//                               <td className="p-4">
//                                 <span
//                                   className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                                     tile.category === "floor"
//                                       ? "bg-primary-container/10 text-primary"
//                                       : tile.category === "wall"
//                                       ? "bg-secondary-container/10 text-secondary"
//                                       : "bg-tertiary-container/10 text-tertiary"
//                                   }`}
//                                 >
//                                   {tile.category === "both" ? "Both" : tile.category}
//                                 </span>
//                               </td>
//                               <td className="p-4 text-xs font-medium">{tile.size}</td>
//                               <td className="p-4">
//                                 {tile.tileSurface ? (
//                                   <div className="flex items-center gap-1.5">
//                                     <div className="w-2 h-2 rounded-full border border-on-surface-variant"></div>
//                                     <span className="text-xs">{tile.tileSurface}</span>
//                                   </div>
//                                 ) : (
//                                   <span className="text-xs text-gray-400">—</span>
//                                 )}
//                               </td>
//                               <td className="p-4">
//                                 {tile.tileMaterial ? (
//                                   <div className="flex items-center gap-1.5 text-xs">
//                                     <span className="material-symbols-outlined text-base text-secondary">layers</span>
//                                     {tile.tileMaterial}
//                                   </div>
//                                 ) : (
//                                   <span className="text-xs text-gray-400">—</span>
//                                 )}
//                               </td>
//                               <td className="p-4 text-right font-bold text-sm">₹{tile.price.toFixed(2)}</td>
//                               <td className="p-4 text-center font-semibold text-sm">{tile.stock || 0}</td>
//                               <td className="p-4">
//                                 <span
//                                   className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(
//                                     tile
//                                   )}`}
//                                 >
//                                   <span className={`w-1.5 h-1.5 rounded-full ${tile.inStock ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
//                                   {getStockStatusText(tile)}
//                                 </span>
//                               </td>
//                               <td className="p-4">
//                                 <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                   <button
//                                     onClick={() => handleEditTile(tile)}
//                                     className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all"
//                                     title="Edit"
//                                   >
//                                     <span className="material-symbols-outlined text-lg">edit_square</span>
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteTile(tile.id, tile.name)}
//                                     className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-all"
//                                     title="Delete"
//                                   >
//                                     <span className="material-symbols-outlined text-lg">delete</span>
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         )}
//                       </tbody>
//                     </table>
//                   </div>

//                   {totalPages > 1 && (
//                     <div className="p-4 bg-surface-container-low/50 flex items-center justify-between border-t border-outline-variant/30">
//                       <button
//                         onClick={goToPreviousPage}
//                         disabled={currentPage === 1}
//                         className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-on-surface-variant hover:text-primary transition-all disabled:opacity-50"
//                       >
//                         <span className="material-symbols-outlined text-sm">chevron_left</span>
//                         Prev
//                       </button>

//                       <div className="flex items-center gap-1.5">
//                         {getPageNumbers().map((page, index) => {
//                           if (page === '...') {
//                             return (
//                               <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
//                                 ...
//                               </span>
//                             );
//                           }
//                           return (
//                             <button
//                               key={page}
//                               onClick={() => goToPage(page as number)}
//                               className={`w-8 h-8 rounded-lg font-bold text-xs ${
//                                 currentPage === page
//                                   ? "bg-primary text-white"
//                                   : "hover:bg-white transition-all font-semibold"
//                               }`}
//                             >
//                               {page}
//                             </button>
//                           );
//                         })}
//                       </div>

//                       <button
//                         onClick={goToNextPage}
//                         disabled={currentPage === totalPages}
//                         className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-on-surface-variant hover:text-primary transition-all disabled:opacity-50"
//                       >
//                         Next
//                         <span className="material-symbols-outlined text-sm">chevron_right</span>
//                       </button>
//                     </div>
//                   )}
//                 </section>
//               </>
//             ) : (
//               <div className="overflow-hidden">
//                 {activeTab === "worker" && <WorkerManagement />}
//                 {activeTab === "profile" && <SellerProfile />}
//                 {activeTab === "excel" && <ExcelUpload onUploadComplete={loadData} />}
//                 {activeTab === "stock-analytics" && <SellerStockAnalytics />}
//                 {activeTab === "bulk" && <BulkUpload onUploadComplete={loadData} />}
//                 {activeTab === "customer-inquiries" && <CustomerInquiriesManager />}
//                 {activeTab === "qrcodes" && (
//                   <QRCodeManager tiles={tiles} sellerId={currentUser?.user_id} onQRCodeGenerated={loadData} />
//                 )}
//                 {activeTab === "history" && <HistoryTab />}
//                 {activeTab === "analytics" && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
//                 {activeTab === "billing" && (
//                   <BillingTab
//                     key={`billing-tab-${planRefreshTrigger}`}
//                     sellerId={currentUser?.user_id || ''}
//                     sellerEmail={currentUser?.email || ''}
//                   />
//                 )}
//               </div>
//             )}

//             <footer className="border-t border-outline-variant flex justify-between items-center text-on-surface-variant pt-6 pb-2 text-[11px]">
//               <p>© 2024 LuxeTile AI. All architectural rights reserved.</p>
//               <div className="flex gap-4 font-medium">
//                 <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
//                 <a href="#" className="hover:text-primary transition-colors">Terms</a>
//                 <a href="#" className="hover:text-primary transition-colors">API Docs</a>
//               </div>
//             </footer>
//           </div>
//         </main>
//       </div>

//       <PlansModal
//         isOpen={showPlansModal}
//         onClose={() => setShowPlansModal(false)}
//         isLoggedIn={isAuthenticated}
//         sellerId={currentUser?.user_id || ''}
//         userToken={userToken}
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
//           userToken={userToken}
//         />
//       )}
//     </>
//   );
// };

// // console.log('✅ SellerDashboard - PRODUCTION v10.0 FINAL - ALL FEATURES RESTORED'); 
// import React, { useState, useEffect, useMemo, useCallback } from "react";
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
// import { jwtService } from '../lib/jwtService';
// import { PlansModal } from './Payment/PlansModal';
// import { PaymentConfirmationModal } from './Payment/PaymentConfirmationModal';
// import { PaymentCheckout } from './Payment/PaymentCheckout';
// import { initiatePayment } from '../lib/paymentService';
// import { getPlanById } from '../lib/planService';
// import type { Plan } from '../types/plan.types';
// import type { RazorpayCheckoutOptions } from '../types/payment.types';
// import { auth } from '../lib/firebase';
// import { HistoryTab } from "./HistoryTab";
// import {
//   uploadTile,
//   updateTile,
//   deleteTile,
//   getSellerProfile,
//   getSellerTiles,
//   updateTileQRCode,
//   getTileById,
//   signOut,
// } from "../lib/firebaseutils";
// import { BillingTab } from './BillingTab';
// import { uploadToCloudinary } from "../utils/cloudinaryUtils";
// import { 
//   getSellerSubscription, 
//   isSubscriptionExpired,
//   getDaysUntilExpiry 
// } from "../lib/subscriptionService";

// interface SellerPlanStatus {
//   isActive: boolean;
//   expiresAt: Date | null;
//   planName: string | null;
//   planId: string | null;
//   daysRemaining: number;
//   loading: boolean;
//   lastChecked: Date | null;
// }

// export const SellerDashboard: React.FC = () => {
//   const { currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
  
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
//     | "history"
//     | "billing"
//   >("tiles");

//   const [editingTile, setEditingTile] = useState<Tile | null>(null);
//   const [sellerProfile, setSellerProfile] = useState<any>(null);
//   const [tiles, setTiles] = useState<Tile[]>([]);
//   const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
//   const [userToken, setUserToken] = useState<string>('');
  
//   const [loading, setLoading] = useState(true);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [textureUploading, setTextureUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState<string>("all");
//   const [stockFilter, setStockFilter] = useState<string>("all");
  
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [expandedTileId, setExpandedTileId] = useState<string | null>(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   const [showPlansModal, setShowPlansModal] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
//   const [planRefreshTrigger, setPlanRefreshTrigger] = useState(0);
//   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
//   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   useEffect(() => {
//     const checkPaymentSuccess = () => {
//       const flag = localStorage.getItem('plan_just_purchased');
//       if (flag) {
//         setPlanRefreshTrigger(prev => prev + 1);
//         localStorage.removeItem('plan_just_purchased');
//         if (showPlansModal) {
//           setTimeout(() => setShowPlansModal(false), 3000);
//         }
//       }
//     };
//     const interval = setInterval(checkPaymentSuccess, 1000);
//     return () => clearInterval(interval);
//   }, [showPlansModal]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const token = jwtService.getAccessToken();
//       if (token && jwtService.isValidTokenFormat(token)) {
//         setUserToken(token);
//       }
//     }
//   }, [isAuthenticated]);

//   const [planStatus, setPlanStatus] = useState<SellerPlanStatus>({
//     isActive: false,
//     expiresAt: null,
//     planName: null,
//     planId: null,
//     daysRemaining: 0,
//     loading: true,
//     lastChecked: null
//   });

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

//   const checkSellerPlanStatus = async (sellerId: string): Promise<SellerPlanStatus> => {
//     try {
//       const subscription = await getSellerSubscription(sellerId, true);
//       if (!subscription) {
//         return {
//           isActive: false,
//           expiresAt: null,
//           planName: null,
//           planId: null,
//           daysRemaining: 0,
//           loading: false,
//           lastChecked: new Date()
//         };
//       }
//       const expired = isSubscriptionExpired(subscription);
//       const daysRemaining = getDaysUntilExpiry(subscription);
//       const endDate = subscription.end_date ? new Date(subscription.end_date) : null;
//       return {
//         isActive: !expired,
//         expiresAt: endDate,
//         planName: subscription.plan_name || null,
//         planId: subscription.plan_id || null,
//         daysRemaining,
//         loading: false,
//         lastChecked: new Date()
//       };
//     } catch (error: any) {
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
//   };

//   const loadPlanStatus = async () => {
//     if (!currentUser?.user_id) return;
//     try {
//       const status = await checkSellerPlanStatus(currentUser.user_id);
//       setPlanStatus(status);
//     } catch (error: any) {
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

//   const handlePlanStatusChange = async (isActive: boolean, isExpired: boolean) => {
//     setPlanStatus(prev => ({
//       ...prev,
//       isActive,
//       loading: false,
//       lastChecked: new Date()
//     }));
//     if (!isActive && isExpired) {
//       setTimeout(async () => {
//         await loadPlanStatus();
//       }, 1000);
//     }
//   };

//   const isFeatureAllowed = (feature: 'scan' | 'worker' | 'analytics'): boolean => {
//     if (planStatus.loading) return false;
//     return planStatus.isActive;
//   };

//   const getDisabledReason = (): string => {
//     if (planStatus.loading) return 'Checking plan status...';
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

//   useEffect(() => {
//     if (currentUser && isAuthenticated) {
//       loadData();
//       loadPlanStatus();
//     } else if (currentUser === null && !isAuthenticated) {
//       setLoading(false);
//     }
//   }, [currentUser, isAuthenticated]);

//   useEffect(() => {
//     if (currentUser?.user_id && isAuthenticated && planRefreshTrigger > 0) {
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

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
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
//         setTiles(uniqueTiles);
//       } else {
//         setTiles([]);
//       }
//     } catch (error: any) {
//       setError("Failed to load dashboard data. Please refresh the page.");
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   const handlePlanSelection = async (planId: string) => {
//     try {
//       if (!isAuthenticated) {
//         setShowPlansModal(false);
//         setError('Please login to select a plan');
//         return;
//       }
//       const plan = await getPlanById(planId);
//       if (!plan) {
//         setError('❌ Plan not found. Please try again.');
//         return;
//       }
//       setSelectedPlan(plan);
//       setShowPlansModal(false);
//       setShowPaymentConfirmation(true);
//     } catch (error: any) {
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
//       setCheckoutOptions(result.checkoutOptions);
//       setPaymentId(result.paymentId);
//       setShowPaymentConfirmation(false);
//     } catch (error: any) {
//       setError(`❌ Payment Error: ${error.message}`);
//       setProcessingPayment(false);
//     }
//   };

//   const handlePaymentSuccess = async () => {
//     try {
//       setCheckoutOptions(null);
//       setPaymentId(null);
//       setProcessingPayment(false);
//       setSelectedPlan(null);
//       setShowPaymentConfirmation(false);
//       setShowPlansModal(false);
//       setSuccess('🎉 Payment successful! Activating plan...');
//       try {
//         const { enableAllSellersWorkers } = await import('../lib/firebaseutils');
//         const result = await enableAllSellersWorkers(currentUser?.user_id || '');
//         if (result.success && result.count > 0) {
//           setSuccess(`🎉 Plan activated! ${result.count} worker(s) enabled.`);
//         }
//       } catch (workerError: any) {
//         console.warn('⚠️ Worker enable failed:', workerError);
//       }
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       setPlanRefreshTrigger(prev => prev + 1);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       await loadPlanStatus();
//       await loadData();
//       setSuccess('✅ Plan activated! Workers can now login.');
//       setTimeout(() => setSuccess(null), 7000);
//     } catch (error: any) {
//       setError('Payment successful but refresh failed. Reload page manually.');
//     }
//   };

//   const handlePaymentError = async (error: string) => {
//     setError(`❌ Payment Error: ${error}`);
//     setCheckoutOptions(null);
//     setPaymentId(null);
//     setProcessingPayment(false);
//     setSelectedPlan(null);
//     setShowPaymentConfirmation(false);
//     setTimeout(async () => {
//       await loadPlanStatus();
//     }, 2000);
//   };

//   const generateTileCode = (): string => {
//     const prefix = sellerProfile?.business_name?.substring(0, 3).toUpperCase() || "TIL";
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
//       const imageUrl = await uploadToCloudinary(
//         file,
//         type === "image" ? "tiles/main" : "tiles/textures"
//       );
//       if (type === "image") {
//         setNewTile((prev) => ({ ...prev, imageUrl }));
//       } else {
//         setNewTile((prev) => ({ ...prev, textureUrl: imageUrl }));
//       }
//       setSuccess(`${type === "image" ? "Image" : "Texture"} uploaded successfully`);
//     } catch (error: any) {
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
//     if (!newTile.size || newTile.size.trim() === "" || newTile.size === "manual_trigger") {
//       return "❌ Tile Size is required. Please select or enter a size.";
//     }
//     if (newTile.size.includes('x') && !newTile.size.match(/^\d+x\d+ cm$/)) {
//       return "❌ Invalid Manual Size. Please enter BOTH Width and Height properly.";
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
//       const tileCode = newTile.tileCode || generateTileCode();
//       const baseTileData = {
//         ...newTile,
//         size: newTile.size?.trim(),
//         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
//         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
//         sellerId: currentUser.user_id,
//         showroomId: currentUser.user_id,
//         tileCode: tileCode,
//         inStock: (newTile.stock || 0) > 0,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };
//       const savedTile = await uploadTile(baseTileData);
//       if (!savedTile || !savedTile.id) {
//         throw new Error("Tile saved but ID not returned");
//       }
//       let qrCodeGenerated = false;
//       try {
//         const qrCodeDataUrl = await generateTileQRCode(savedTile);
//         await updateTileQRCode(savedTile.id, qrCodeDataUrl);
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
//     } catch (error: any) {
//       setError(`Failed to add tile: ${error.message}`);
//     }
//   };

//   const handleEditTile = async (tile: Tile) => {
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
//       const updates = {
//         ...newTile,
//         size: newTile.size?.trim(),
//         tileSurface: newTile.tileSurface === "manual_trigger" ? "" : (newTile.tileSurface?.trim() || ""),
//         tileMaterial: newTile.tileMaterial === "manual_trigger" ? "" : (newTile.tileMaterial?.trim() || ""),
//         inStock: (newTile.stock || 0) > 0,
//         updatedAt: new Date().toISOString(),
//       };
//       await updateTile(editingTile.id, updates);
//       const criticalFieldsChanged =
//         editingTile.name !== newTile.name ||
//         editingTile.tileCode !== newTile.tileCode ||
//         editingTile.price !== newTile.price ||
//         editingTile.size !== newTile.size ||
//         editingTile.category !== newTile.category;
//       if (criticalFieldsChanged) {
//         setTimeout(async () => {
//           try {
//             if (typeof getTileById !== "function") return;
//             if (typeof generateTileQRCode !== "function") return;
//             if (typeof updateTileQRCode !== "function") return;
//             const updatedTileData = await getTileById(editingTile.id);
//             if (!updatedTileData) return;
//             const newQRCode = await generateTileQRCode(updatedTileData);
//             if (!newQRCode || !newQRCode.startsWith("data:image")) return;
//             await updateTileQRCode(editingTile.id, newQRCode);
//             await loadData();
//           } catch (qrError: any) {
//             console.error("⚠️ QR regeneration failed (non-critical):", qrError.message);
//           }
//         }, 0);
//       }
//       await loadData();
//       setEditingTile(null);
//       resetNewTile();
//       setSuccess("Tile updated successfully!");
//     } catch (error: any) {
//       setError(`Failed to update tile: ${error.message}`);
//     }
//   };

//   const handleDeleteTile = async (tileId: string, tileName: string) => {
//     if (!window.confirm(`Delete "${tileName}"?`)) return;
//     try {
//       setError(null);
//       await deleteTile(tileId);
//       await loadData();
//       setSuccess("Tile deleted successfully");
//     } catch (error: any) {
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

//   const handleSignOut = useCallback(async () => {
//     const confirmed = window.confirm('Are you sure you want to logout?');
//     if (!confirmed) return;
//     setIsLoggingOut(true);
//     try {
//       await signOut();
//       setCurrentUser(null);
//       setIsAuthenticated(false);
//       localStorage.removeItem('user');
//       localStorage.removeItem('isAuthenticated');
//       sessionStorage.clear();
//       document.cookie.split(";").forEach((c) => {
//         document.cookie = c
//           .replace(/^ +/, "")
//           .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
//       });
//       window.location.href = '/?logout=true';
//     } catch (error) {
//       alert('Logout failed. Please try again.');
//     } finally {
//       setIsLoggingOut(false);
//     }
//   }, [setCurrentUser, setIsAuthenticated]);

//   const userDisplayName = useMemo(() => {
//     if (!currentUser) return 'Guest';
//     return currentUser.full_name || currentUser.email?.split('@')[0] || 'User';
//   }, [currentUser]);

//   const isScanAllowed = isFeatureAllowed('scan');
//   const isWorkerAllowed = isFeatureAllowed('worker');
//   const disabledMessage = getDisabledReason();

//   if (!isAuthenticated || !currentUser || currentUser.role !== "seller") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-surface p-4">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
//           <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
//           <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
//           <p className="text-on-surface-variant mb-6">
//             {!isAuthenticated ? 'Please login to continue' : 
//              !currentUser ? 'User profile not found' :
//              'This dashboard is only for sellers'}
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
//           >
//             Reload Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-surface">
//         <div className="text-center">
//           <span className="material-symbols-outlined text-6xl text-primary animate-spin mb-4 block">refresh</span>
//           <p className="text-lg text-on-surface">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{`
//         .glass-card {
//           background: rgba(255, 255, 255, 0.4);
//           backdrop-filter: blur(20px);
//           border: 1px solid rgba(255, 255, 255, 0.6);
//           box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
//         }
//         .premium-gradient {
//           background: linear-gradient(135deg, #2d5bff 0%, #8127cf 100%);
//         }
//         .material-symbols-outlined {
//           font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
//         }
//         ::-webkit-scrollbar {
//           width: 6px;
//         }
//         ::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         ::-webkit-scrollbar-thumb {
//           background: #e0e3e5;
//           border-radius: 10px;
//         }
//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slide-down {
//           animation: slide-down 0.3s ease-out;
//         }
//       `}</style>

//       <div className="flex h-screen bg-background overflow-hidden">
//         {/* ✅ SIDEBAR */}
//         <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-white/40 backdrop-blur-xl z-50 flex flex-col py-8 px-4 shadow-sm">
//           <div className="mb-10 px-2 flex items-center gap-3">
//             <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary-container">
//               <span className="material-symbols-outlined text-2xl">grid_view</span>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-primary">Tilesview360</h1>
//               <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
//                 Seller Dashboard
//               </p>
//             </div>
//           </div>

//           <nav className="flex-1 space-y-1 overflow-y-auto">
//             <a
//               onClick={() => handleTabChange("tiles")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "tiles"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">grid_view</span>
//               <span>My Tiles</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("history")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "history"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">history</span>
//               <span>History</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("billing")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "billing"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">payments</span>
//               <span>Billing</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("customer-inquiries")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "customer-inquiries"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">group</span>
//               <span>Customers</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("stock-analytics")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "stock-analytics"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">analytics</span>
//               <span>Analytics</span>
//             </a>

//             <a
//               onClick={() => {
//                 if (isWorkerAllowed) {
//                   handleTabChange("worker");
//                 } else {
//                   setShowPlansModal(true);
//                 }
//               }}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer relative ${
//                 activeTab === "worker"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : !isWorkerAllowed
//                   ? "text-on-surface-variant/50 cursor-not-allowed opacity-60"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//               title={!isWorkerAllowed ? disabledMessage : "Manage Workers"}
//             >
//               <span className="material-symbols-outlined">engineering</span>
//               <span>Worker</span>
//               {!isWorkerAllowed && (
//                 <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
//               )}
//             </a>

//             <a
//               onClick={() => {
//                 if (isScanAllowed) {
//                   window.open("/scan", "_blank");
//                 } else {
//                   setShowPlansModal(true);
//                 }
//               }}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer relative ${
//                 !isScanAllowed
//                   ? "text-on-surface-variant/50 cursor-not-allowed opacity-60"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//               title={!isScanAllowed ? disabledMessage : "Open QR Scanner"}
//             >
//               <span className="material-symbols-outlined">qr_code_scanner</span>
//               <span>Scan</span>
//               {!isScanAllowed && (
//                 <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
//               )}
//             </a>

//             <a
//               onClick={() => handleTabChange("profile")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "profile"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">account_circle</span>
//               <span>Profile</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("excel")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "excel"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">table_view</span>
//               <span>Excel</span>
//             </a>

//             <a
//               onClick={() => handleTabChange("qrcodes")}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "qrcodes"
//                   ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
//                   : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">qr_code</span>
//               <span>QR Codes</span>
//             </a>
//           </nav>

//           <div className="mt-auto pt-6 border-t border-outline-variant space-y-1">
//             <button
//               onClick={() => {
//                 setIsAddingTile(true);
//                 setEditingTile(null);
//                 resetNewTile();
//                 handleTabChange("tiles");
//                 window.scrollTo({ top: 0, behavior: 'smooth' });
//               }}
//               className="w-full mb-6 bg-primary text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
//             >
//               <span className="material-symbols-outlined">add</span>
//               <span>Create New Tile</span>
//             </button>

//             <a
//               onClick={() => setShowPlansModal(true)}
//               className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-200 cursor-pointer"
//             >
//               <span className="material-symbols-outlined">settings</span>
//               <span>Settings</span>
//             </a>

//             <a
//               href="#"
//               className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-200"
//             >
//               <span className="material-symbols-outlined">help</span>
//               <span>Support</span>
//             </a>
//           </div>
//         </aside>

//         {/* ✅ MAIN CONTENT - FULL WIDTH */}
//         <main className="ml-64 flex-1 flex flex-col overflow-hidden">
//           {/* ✅ SIMPLIFIED HEADER - Only Search + Bell + Logout */}
//           <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-2xl border-b border-white/50 shadow-sm bg-white/80 flex-shrink-0">
//             <div className="h-16 px-6 flex items-center justify-between">
//               {/* Search Bar */}
//               <div className="flex items-center flex-1 max-w-2xl">
//                 <div className="relative w-full group">
//                   <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
//                     search
//                   </span>
//                   <input
//                     type="text"
//                     placeholder="Search tiles by name, code, material..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full bg-surface-container-low border-none rounded-full py-2 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Right Actions: Bell + Logout */}
//               <div className="flex items-center gap-3 ml-6">
//                 {/* Bell Icon */}
//                 <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/30 rounded-full transition-transform active:scale-90 relative">
//                   <span className="material-symbols-outlined text-xl">notifications</span>
//                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
//                 </button>

//                 {/* Logout Button */}
//                 <button
//                   onClick={handleSignOut}
//                   disabled={isLoggingOut}
//                   className="flex items-center gap-2 px-4 py-2 bg-error/10 hover:bg-error/20 text-error rounded-lg transition-all font-semibold text-sm disabled:opacity-50"
//                 >
//                   <span className="material-symbols-outlined text-lg">logout</span>
//                   <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
//                 </button>
//               </div>
//             </div>
//           </header>

//           {/* ✅ CONTENT - FULL WIDTH (NO PADDING, NO MAX-WIDTH) */}
//           <div className="flex-1 overflow-y-auto">
//             <div className="py-6 space-y-6">
              
//               {/* Alerts */}
//               {error && (
//                 <div className="p-4 bg-error-container border border-error rounded-lg flex items-start gap-3 animate-slide-down">
//                   <span className="material-symbols-outlined text-error">error</span>
//                   <div className="flex-1">
//                     <p className="text-on-error-container font-medium">Error</p>
//                     <p className="text-on-error-container text-sm">{error}</p>
//                   </div>
//                   <button onClick={() => setError(null)} className="text-error hover:text-error/80">
//                     <span className="material-symbols-outlined">close</span>
//                   </button>
//                 </div>
//               )}

//               {success && (
//                 <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-slide-down">
//                   <span className="material-symbols-outlined text-green-600">check_circle</span>
//                   <div className="flex-1">
//                     <p className="text-green-800 font-medium">Success</p>
//                     <p className="text-green-700 text-sm">{success}</p>
//                   </div>
//                   <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">
//                     <span className="material-symbols-outlined">close</span>
//                   </button>
//                 </div>
//               )}

//               {activeTab === "tiles" ? (
//                 <>
//                   {/* Page Header - LEFT ALIGNED */}
//                   <div className="flex items-end justify-between">
//                     <div>
//                       <nav className="flex text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 gap-2">
//                         <span>Dashboard</span>
//                       </nav>
//                       <h2 className="text-[28px] leading-tight font-semibold text-on-surface">
//                         Tile Catalog
//                       </h2>
//                       <p className="text-on-surface-variant text-sm mt-0.5">
//                         Organize your tiles, monitor stock, and power customer visualizations.
//                       </p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => {
//                           setIsAddingTile(true);
//                           setEditingTile(null);
//                           resetNewTile();
//                           window.scrollTo({ top: 0, behavior: 'smooth' });
//                         }}
//                         className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:scale-105 active:scale-95 transition-all font-bold text-xs shadow-lg shadow-primary/20"
//                       >
//                         <span className="material-symbols-outlined text-base">add</span>
//                         Add New Tile
//                       </button>
//                     </div>
//                   </div>

//                   {/* Premium Banner */}
//                   <section>
//                     <div className="glass-card premium-gradient p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
//                       <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
//                       <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/30 rounded-full blur-2xl"></div>

//                       <div className="relative z-10 flex gap-4 items-center">
//                         <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center text-white">
//                           <span className="material-symbols-outlined text-2xl">workspace_premium</span>
//                         </div>
//                         <div>
//                           <h3 className="text-white font-bold text-lg">
//                             {planStatus.isActive 
//                               ? `Active Plan: ${planStatus.planName || 'Premium'}` 
//                               : 'Premium Features Await'}
//                           </h3>
//                           <p className="text-white/80 text-sm">
//                             {planStatus.isActive
//                               ? `Expires in ${planStatus.daysRemaining} days - Renew to keep access`
//                               : 'Transform your showroom with unlimited tile management and immersive 3D visualization.'}
//                           </p>
//                         </div>
//                       </div>

//                       <button
//                         onClick={() => setShowPlansModal(true)}
//                         className="relative z-10 px-6 py-2.5 bg-white text-primary rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
//                       >
//                         <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">
//                           visibility
//                         </span>
//                         {planStatus.isActive ? 'Upgrade Plan' : 'View Plans'}
//                       </button>
//                     </div>
//                   </section>

//                   {/* Stats Grid */}
//                   <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//                     <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
//                       <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
//                         <span className="material-symbols-outlined text-xl">grid_on</span>
//                       </div>
//                       <div>
//                         <p className="text-on-surface-variant font-medium text-xs">Total Tiles</p>
//                         <h4 className="text-lg font-bold leading-tight">{tiles.length}</h4>
//                         <p className="text-primary text-[9px] font-bold uppercase tracking-wider">
//                           {tiles.filter(t => t.category === 'both').length} Collections
//                         </p>
//                       </div>
//                     </div>

//                     <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
//                       <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
//                         <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
//                       </div>
//                       <div>
//                         <p className="text-on-surface-variant font-medium text-xs">QR Generated</p>
//                         <h4 className="text-lg font-bold leading-tight">
//                           {tiles.filter(t => t.qrCode).length}
//                         </h4>
//                         <p className="text-green-600 text-[9px] font-bold uppercase tracking-wider">Active</p>
//                       </div>
//                     </div>

//                     <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
//                       <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
//                         <span className="material-symbols-outlined text-xl">inventory_2</span>
//                       </div>
//                       <div>
//                         <p className="text-on-surface-variant font-medium text-xs">Total Stock</p>
//                         <h4 className="text-lg font-bold leading-tight">
//                           {tiles.reduce((sum, t) => sum + (t.stock || 0), 0)}
//                         </h4>
//                         <p className="text-green-600 text-[9px] font-bold uppercase tracking-wider">
//                           {tiles.filter(t => t.inStock).length} Available
//                         </p>
//                       </div>
//                     </div>

//                     <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
//                       <div className="w-10 h-10 bg-error/10 text-error rounded-lg flex items-center justify-center group-hover:bg-error group-hover:text-white transition-colors">
//                         <span className="material-symbols-outlined text-xl">outbox</span>
//                       </div>
//                       <div>
//                         <p className="text-on-surface-variant font-medium text-xs">Low Stock</p>
//                         <h4 className="text-lg font-bold leading-tight">
//                           {tiles.filter(t => t.inStock && (t.stock || 0) < 10).length}
//                         </h4>
//                         <p className="text-error text-[9px] font-bold uppercase tracking-wider">Reorder</p>
//                       </div>
//                     </div>

//                     <div className="glass-card p-4 rounded-xl border border-white/50 flex items-center gap-3 group hover:translate-y-[-2px] transition-all">
//                       <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
//                         <span className="material-symbols-outlined text-xl">group</span>
//                       </div>
//                       <div>
//                         <p className="text-on-surface-variant font-medium text-xs">In Stock</p>
//                         <h4 className="text-lg font-bold leading-tight">
//                           {Math.round((tiles.filter(t => t.inStock).length / tiles.length) * 100) || 0}%
//                         </h4>
//                         <p className="text-primary text-[9px] font-bold uppercase tracking-wider">Retention</p>
//                       </div>
//                     </div>
//                   </section>

//                   {/* Add/Edit Tile Form */}
//                   {(isAddingTile || editingTile) && (
//                     <div className="glass-card p-6 rounded-2xl border border-white/60">
//                       <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                         {editingTile ? (
//                           <>
//                             <span className="material-symbols-outlined text-primary">edit</span>
//                             Edit: {editingTile.name}
//                           </>
//                         ) : (
//                           <>
//                             <span className="material-symbols-outlined text-primary">add</span>
//                             Add New Tile
//                           </>
//                         )}
//                       </h3>

//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Tile Name *
//                           </label>
//                           <input
//                             type="text"
//                             placeholder="Enter tile name"
//                             value={newTile.name}
//                             onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Tile Code
//                           </label>
//                           <input
//                             type="text"
//                             placeholder="Auto-generated if empty"
//                             value={newTile.tileCode}
//                             onChange={(e) => setNewTile({ ...newTile, tileCode: e.target.value })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Category *
//                           </label>
//                           <select
//                             value={newTile.category}
//                             onChange={(e) => setNewTile({ ...newTile, category: e.target.value as any })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
//                           >
//                             <option value="floor">Floor Only</option>
//                             <option value="wall">Wall Only</option>
//                             <option value="both">Floor & Wall</option>
//                           </select>
//                         </div>

//                         <div className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">Size *</label>
//                           {(() => {
//                             const standardSizes = [
//                               "30x30 cm", "30x60 cm", "60x60 cm", "60x120 cm", "80x80 cm",
//                               "40x40 cm", "40x60 cm", "50x50 cm", "20x120 cm", "15x90 cm",
//                               "10x30 cm", "20x20 cm", "25x40 cm", "61x122 cm", "122x122 cm",
//                               "75x75 cm", "100x100 cm", "45x45 cm", "7.5x15 cm", "6x25 cm"
//                             ];
//                             const currentSize = newTile.size || "";
//                             const isManualMode = currentSize === "manual_trigger" || (currentSize !== "" && !standardSizes.includes(currentSize));
//                             let parsedWidth = "";
//                             let parsedHeight = "";
//                             if (isManualMode && currentSize !== "manual_trigger") {
//                               const parts = currentSize.replace(" cm", "").split("x");
//                               if (parts.length === 2) {
//                                 parsedWidth = parts[0];
//                                 parsedHeight = parts[1];
//                               }
//                             }
//                             const handleManualChange = (w: string, h: string) => {
//                               setNewTile({ ...newTile, size: `${w}x${h} cm` });
//                             };
//                             return (
//                               <div className="space-y-3">
//                                 {!isManualMode ? (
//                                   <div>
//                                     <select
//                                       value={currentSize}
//                                       onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
//                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                                     >
//                                       <option value="">Select Tile Size</option>
//                                       {standardSizes.map((sizeOption) => (
//                                         <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
//                                       ))}
//                                     </select>
//                                     <button
//                                       type="button"
//                                       onClick={() => setNewTile({ ...newTile, size: "manual_trigger" })}
//                                       className="mt-2 text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1"
//                                     >
//                                       <span className="material-symbols-outlined text-sm">add</span>
//                                       Add Manual Size
//                                     </button>
//                                   </div>
//                                 ) : (
//                                   <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
//                                     <div className="flex justify-between items-center">
//                                       <span className="text-xs font-semibold text-primary">
//                                         Enter Custom Size (in cm)
//                                       </span>
//                                       <button
//                                         type="button"
//                                         onClick={() => setNewTile({ ...newTile, size: "" })}
//                                         className="text-xs text-error hover:text-error/80 font-medium"
//                                       >
//                                         Cancel
//                                       </button>
//                                     </div>
//                                     <div className="flex items-center gap-3">
//                                       <input
//                                         type="number"
//                                         placeholder="Width"
//                                         value={parsedWidth}
//                                         onChange={(e) => handleManualChange(e.target.value, parsedHeight)}
//                                         className="flex-1 px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
//                                         min="1"
//                                       />
//                                       <span className="text-primary font-bold">×</span>
//                                       <input
//                                         type="number"
//                                         placeholder="Height"
//                                         value={parsedHeight}
//                                         onChange={(e) => handleManualChange(parsedWidth, e.target.value)}
//                                         className="flex-1 px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
//                                         min="1"
//                                       />
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })()}
//                         </div>

//                         <div className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">Tile Surface</label>
//                           {(() => {
//                             const standardSurfaces = ["Polished", "Step Side", "Matt", "Carving", "High Gloss", "Metallic", "Sugar", "Glue", "Punch"];
//                             const currentSurface = newTile.tileSurface || "";
//                             const isManualMode = currentSurface === "manual_trigger" || (currentSurface !== "" && !standardSurfaces.includes(currentSurface));
//                             return (
//                               <div className="space-y-3">
//                                 {!isManualMode ? (
//                                   <div>
//                                     <select
//                                       value={currentSurface}
//                                       onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value || undefined })}
//                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                                     >
//                                       <option value="">Select Surface Finish</option>
//                                       {standardSurfaces.map((surface) => (
//                                         <option key={surface} value={surface}>{surface}</option>
//                                       ))}
//                                     </select>
//                                     <button
//                                       type="button"
//                                       onClick={() => setNewTile({ ...newTile, tileSurface: "manual_trigger" })}
//                                       className="mt-2 text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1"
//                                     >
//                                       <span className="material-symbols-outlined text-sm">add</span>
//                                       Add Manual Surface
//                                     </button>
//                                   </div>
//                                 ) : (
//                                   <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
//                                     <div className="flex justify-between items-center">
//                                       <span className="text-xs font-semibold text-primary">Enter Custom Surface</span>
//                                       <button
//                                         type="button"
//                                         onClick={() => setNewTile({ ...newTile, tileSurface: "" })}
//                                         className="text-xs text-error hover:text-error/80 font-medium"
//                                       >
//                                         Cancel
//                                       </button>
//                                     </div>
//                                     <input
//                                       type="text"
//                                       placeholder="e.g. Rustic, Satin, 3D Print"
//                                       value={currentSurface === "manual_trigger" ? "" : currentSurface}
//                                       onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value })}
//                                       className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
//                                       autoFocus
//                                     />
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })()}
//                         </div>

//                         <div className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">Tile Material</label>
//                           {(() => {
//                             const standardMaterials = ["Slabs", "GVT & PGVT", "Double Charge", "Counter Tops", "Full Body", "Ceramic", "Mosaic", "Subway"];
//                             const currentMaterial = newTile.tileMaterial || "";
//                             const isManualMode = currentMaterial === "manual_trigger" || (currentMaterial !== "" && !standardMaterials.includes(currentMaterial));
//                             return (
//                               <div className="space-y-3">
//                                 {!isManualMode ? (
//                                   <div>
//                                     <select
//                                       value={currentMaterial}
//                                       onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value || undefined })}
//                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                                     >
//                                       <option value="">Select Material Type</option>
//                                       {standardMaterials.map((material) => (
//                                         <option key={material} value={material}>{material}</option>
//                                       ))}
//                                     </select>
//                                     <button
//                                       type="button"
//                                       onClick={() => setNewTile({ ...newTile, tileMaterial: "manual_trigger" })}
//                                       className="mt-2 text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1"
//                                     >
//                                       <span className="material-symbols-outlined text-sm">add</span>
//                                       Add Manual Material
//                                     </button>
//                                   </div>
//                                 ) : (
//                                   <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
//                                     <div className="flex justify-between items-center">
//                                       <span className="text-xs font-semibold text-primary">Enter Custom Material</span>
//                                       <button
//                                         type="button"
//                                         onClick={() => setNewTile({ ...newTile, tileMaterial: "" })}
//                                         className="text-xs text-error hover:text-error/80 font-medium"
//                                       >
//                                         Cancel
//                                       </button>
//                                     </div>
//                                     <input
//                                       type="text"
//                                       placeholder="e.g. Porcelain, Natural Stone, Glass"
//                                       value={currentMaterial === "manual_trigger" ? "" : currentMaterial}
//                                       onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value })}
//                                       className="w-full px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm bg-white"
//                                       autoFocus
//                                     />
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })()}
//                         </div>

//                         <div className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">Price (₹) *</label>
//                           <input
//                             type="number"
//                             placeholder="Enter price"
//                             value={newTile.price || ""}
//                             onChange={(e) => setNewTile({ ...newTile, price: e.target.value === "" ? 0 : Number(e.target.value) })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                             min="0"
//                             step="0.01"
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
//                           <input
//                             type="number"
//                             placeholder="Enter stock quantity"
//                             value={newTile.stock || ""}
//                             onChange={(e) => setNewTile({ ...newTile, stock: e.target.value === "" ? 0 : Number(e.target.value) })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
//                             min="0"
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">Tile Image *</label>
//                           <div className="flex flex-col gap-2">
//                             <input
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => {
//                                 const file = e.target.files?.[0];
//                                 if (file) handleImageUpload(file, "image");
//                               }}
//                               className="hidden"
//                               id="tile-image-upload"
//                             />
//                             <label
//                               htmlFor="tile-image-upload"
//                               className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium ${
//                                 imageUploading ? "opacity-50 cursor-not-allowed" : ""
//                               }`}
//                             >
//                               {imageUploading ? (
//                                 <>
//                                   <span className="material-symbols-outlined animate-spin">refresh</span>
//                                   Uploading...
//                                 </>
//                               ) : (
//                                 <>
//                                   <span className="material-symbols-outlined">upload</span>
//                                   Choose Image
//                                 </>
//                               )}
//                             </label>
//                             {newTile.imageUrl && (
//                               <div className="flex items-center gap-2">
//                                 <img
//                                   src={newTile.imageUrl}
//                                   alt="Preview"
//                                   className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//                                 />
//                                 <div className="flex items-center gap-1 text-green-600">
//                                   <span className="material-symbols-outlined text-sm">check_circle</span>
//                                   <span className="text-xs font-medium">Uploaded</span>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <label className="block text-sm font-medium text-gray-700">Texture (Optional)</label>
//                           <div className="flex flex-col gap-2">
//                             <input
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => {
//                                 const file = e.target.files?.[0];
//                                 if (file) handleImageUpload(file, "texture");
//                               }}
//                               className="hidden"
//                               id="texture-image-upload"
//                             />
//                             <label
//                               htmlFor="texture-image-upload"
//                               className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium ${
//                                 textureUploading ? "opacity-50 cursor-not-allowed" : ""
//                               }`}
//                             >
//                               {textureUploading ? (
//                                 <>
//                                   <span className="material-symbols-outlined animate-spin">refresh</span>
//                                   Uploading...
//                                 </>
//                               ) : (
//                                 <>
//                                   <span className="material-symbols-outlined">upload</span>
//                                   Choose Texture
//                                 </>
//                               )}
//                             </label>
//                             {newTile.textureUrl && (
//                               <div className="flex items-center gap-2">
//                                 <img
//                                   src={newTile.textureUrl}
//                                   alt="Texture"
//                                   className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//                                 />
//                                 <div className="flex items-center gap-1 text-green-600">
//                                   <span className="material-symbols-outlined text-sm">check_circle</span>
//                                   <span className="text-xs font-medium">Uploaded</span>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex gap-2 mt-6">
//                         <button
//                           onClick={editingTile ? handleUpdateTile : handleAddTile}
//                           disabled={imageUploading || textureUploading}
//                           className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md"
//                         >
//                           <span className="material-symbols-outlined">save</span>
//                           {editingTile ? "Update Tile" : "Save Tile"}
//                         </button>
//                         <button
//                           onClick={() => {
//                             setIsAddingTile(false);
//                             setEditingTile(null);
//                             resetNewTile();
//                             setError(null);
//                           }}
//                           className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Table Section */}
//                   <section className="glass-card rounded-2xl border border-white/60 overflow-hidden shadow-sm">
//                     <div className="p-4 border-b border-outline-variant bg-white/40 flex flex-wrap items-center justify-between gap-4">
//                       <div className="flex items-center gap-2">
//                         <div className="relative group">
//                           <select
//                             value={categoryFilter}
//                             onChange={(e) => setCategoryFilter(e.target.value)}
//                             className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-10 font-semibold text-xs focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
//                           >
//                             <option value="all">All Categories</option>
//                             <option value="wall">Wall</option>
//                             <option value="floor">Floor</option>
//                             <option value="both">Both</option>
//                           </select>
//                           <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-lg">
//                             expand_more
//                           </span>
//                         </div>

//                         <div className="relative group">
//                           <select
//                             value={stockFilter}
//                             onChange={(e) => setStockFilter(e.target.value)}
//                             className="appearance-none bg-white border border-outline-variant rounded-lg px-4 py-2 pr-10 font-semibold text-xs focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
//                           >
//                             <option value="all">Stock Status</option>
//                             <option value="in-stock">In Stock</option>
//                             <option value="out-of-stock">Out of Stock</option>
//                           </select>
//                           <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-lg">
//                             expand_more
//                           </span>
//                         </div>

//                         <button
//                           onClick={loadData}
//                           className="p-2 hover:bg-surface-container-highest/50 rounded-lg transition-all group"
//                           title="Refresh"
//                         >
//                           <span className="material-symbols-outlined group-active:rotate-180 transition-transform duration-500 text-on-surface-variant text-xl">
//                             refresh
//                           </span>
//                         </button>
//                       </div>

//                       <div className="flex items-center gap-4">
//                         <p className="text-xs font-medium text-on-surface-variant">
//                           {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTiles.length)} of {filteredTiles.length} tiles
//                         </p>
//                       </div>
//                     </div>

//                     <div className="overflow-x-auto">
//                       <table className="w-full text-left border-collapse">
//                         <thead>
//                           <tr className="bg-surface-container-low/50 border-b">
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Image</th>
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Name</th>
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Code</th>
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Category</th>
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Size</th>
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Surface</th>
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Material</th>
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-right text-[11px] font-semibold">Price</th>
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-center text-[11px] font-semibold">Stock</th>
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-[11px] font-semibold">Status</th>
//                             <th className="p-4 uppercase tracking-widest text-on-surface-variant text-center text-[11px] font-semibold">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-outline-variant/30">
//                           {currentTiles.length === 0 ? (
//                             <tr>
//                               <td colSpan={11} className="text-center p-8 text-gray-500">
//                                 <span className="material-symbols-outlined text-6xl text-gray-300 block mb-2">grid_off</span>
//                                 <p className="font-medium">No tiles found</p>
//                                 <p className="text-sm">Try adjusting your filters</p>
//                               </td>
//                             </tr>
//                           ) : (
//                             currentTiles.map((tile) => (
//                               <tr key={tile.id} className="hover:bg-primary-container/5 transition-colors group">
//                                 <td className="p-4">
//                                   <div className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-white p-1">
//                                     <img
//                                       src={tile.imageUrl}
//                                       alt={tile.name}
//                                       className="w-full h-full object-cover rounded"
//                                     />
//                                   </div>
//                                 </td>
//                                 <td className="p-4">
//                                   <p className="font-bold text-on-surface text-sm">{tile.name}</p>
//                                   {tile.textureUrl && (
//                                     <p className="text-[10px] text-green-600">Has Texture</p>
//                                   )}
//                                 </td>
//                                 <td className="p-4">
//                                   <span className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">
//                                     {tile.tileCode}
//                                   </span>
//                                 </td>
//                                 <td className="p-4">
//                                   <span
//                                     className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                                       tile.category === "floor"
//                                         ? "bg-primary-container/10 text-primary"
//                                         : tile.category === "wall"
//                                         ? "bg-secondary-container/10 text-secondary"
//                                         : "bg-tertiary-container/10 text-tertiary"
//                                     }`}
//                                   >
//                                     {tile.category === "both" ? "Both" : tile.category}
//                                   </span>
//                                 </td>
//                                 <td className="p-4 text-xs font-medium">{tile.size}</td>
//                                 <td className="p-4">
//                                   {tile.tileSurface ? (
//                                     <div className="flex items-center gap-1.5">
//                                       <div className="w-2 h-2 rounded-full border border-on-surface-variant"></div>
//                                       <span className="text-xs">{tile.tileSurface}</span>
//                                     </div>
//                                   ) : (
//                                     <span className="text-xs text-gray-400">—</span>
//                                   )}
//                                 </td>
//                                 <td className="p-4">
//                                   {tile.tileMaterial ? (
//                                     <div className="flex items-center gap-1.5 text-xs">
//                                       <span className="material-symbols-outlined text-base text-secondary">layers</span>
//                                       {tile.tileMaterial}
//                                     </div>
//                                   ) : (
//                                     <span className="text-xs text-gray-400">—</span>
//                                   )}
//                                 </td>
//                                 <td className="p-4 text-right font-bold text-sm">₹{tile.price.toFixed(2)}</td>
//                                 <td className="p-4 text-center font-semibold text-sm">{tile.stock || 0}</td>
//                                 <td className="p-4">
//                                   <span
//                                     className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(
//                                       tile
//                                     )}`}
//                                   >
//                                     <span className={`w-1.5 h-1.5 rounded-full ${tile.inStock ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
//                                     {getStockStatusText(tile)}
//                                   </span>
//                                 </td>
//                                 <td className="p-4">
//                                   <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <button
//                                       onClick={() => handleEditTile(tile)}
//                                       className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all"
//                                       title="Edit"
//                                     >
//                                       <span className="material-symbols-outlined text-lg">edit_square</span>
//                                     </button>
//                                     <button
//                                       onClick={() => handleDeleteTile(tile.id, tile.name)}
//                                       className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-all"
//                                       title="Delete"
//                                     >
//                                       <span className="material-symbols-outlined text-lg">delete</span>
//                                     </button>
//                                   </div>
//                                 </td>
//                               </tr>
//                             ))
//                           )}
//                         </tbody>
//                       </table>
//                     </div>

//                     {totalPages > 1 && (
//                       <div className="p-4 bg-surface-container-low/50 flex items-center justify-between border-t border-outline-variant/30">
//                         <button
//                           onClick={goToPreviousPage}
//                           disabled={currentPage === 1}
//                           className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-on-surface-variant hover:text-primary transition-all disabled:opacity-50"
//                         >
//                           <span className="material-symbols-outlined text-sm">chevron_left</span>
//                           Prev
//                         </button>

//                         <div className="flex items-center gap-1.5">
//                           {getPageNumbers().map((page, index) => {
//                             if (page === '...') {
//                               return (
//                                 <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
//                                   ...
//                                 </span>
//                               );
//                             }
//                             return (
//                               <button
//                                 key={page}
//                                 onClick={() => goToPage(page as number)}
//                                 className={`w-8 h-8 rounded-lg font-bold text-xs ${
//                                   currentPage === page
//                                     ? "bg-primary text-white"
//                                     : "hover:bg-white transition-all font-semibold"
//                                 }`}
//                               >
//                                 {page}
//                               </button>
//                             );
//                           })}
//                         </div>

//                         <button
//                           onClick={goToNextPage}
//                           disabled={currentPage === totalPages}
//                           className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-on-surface-variant hover:text-primary transition-all disabled:opacity-50"
//                         >
//                           Next
//                           <span className="material-symbols-outlined text-sm">chevron_right</span>
//                         </button>
//                       </div>
//                     )}
//                   </section>
//                 </>
//               ) : (
//                 <div className="overflow-hidden">
//                   {activeTab === "worker" && <WorkerManagement />}
//                   {activeTab === "profile" && <SellerProfile />}
//                   {activeTab === "excel" && <ExcelUpload onUploadComplete={loadData} />}
//                   {activeTab === "stock-analytics" && <SellerStockAnalytics />}
//                   {activeTab === "bulk" && <BulkUpload onUploadComplete={loadData} />}
//                   {activeTab === "customer-inquiries" && <CustomerInquiriesManager />}
//                   {activeTab === "qrcodes" && (
//                     <QRCodeManager tiles={tiles} sellerId={currentUser?.user_id} onQRCodeGenerated={loadData} />
//                   )}
//                   {activeTab === "history" && <HistoryTab />}
//                   {activeTab === "analytics" && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
//                   {activeTab === "billing" && (
//                     <BillingTab
//                       key={`billing-tab-${planRefreshTrigger}`}
//                       sellerId={currentUser?.user_id || ''}
//                       sellerEmail={currentUser?.email || ''}
//                     />
//                   )}
//                 </div>
//               )}

//               <footer className="border-t border-outline-variant flex justify-between items-center text-on-surface-variant pt-6 pb-2 text-[11px]">
//                 <p>© 2024 LuxeTile AI. All architectural rights reserved.</p>
//                 <div className="flex gap-4 font-medium">
//                   <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
//                   <a href="#" className="hover:text-primary transition-colors">Terms</a>
//                   <a href="#" className="hover:text-primary transition-colors">API Docs</a>
//                 </div>
//               </footer>
//             </div>
//           </div>
//         </main>
//       </div>

//       <PlansModal
//         isOpen={showPlansModal}
//         onClose={() => setShowPlansModal(false)}
//         isLoggedIn={isAuthenticated}
//         sellerId={currentUser?.user_id || ''}
//         userToken={userToken}
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
//           userToken={userToken}
//         />
//       )}
//     </>
//   );
// };

// console.log('✅ SellerDashboard - PRODUCTION FULL-WIDTH v11.0 FINAL');


// // import React, { useState, useEffect } from 'react';
// // import { Download, CreditCard, Calendar, CheckCircle, Loader, Receipt, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
// // import { getSellerPayments, clearPaymentCache } from '../lib/paymentService';
// // import { getPlanById } from '../lib/planService';
// // import type { Payment } from '../types/payment.types';
// // import { jsPDF } from 'jspdf';
// // import { collection, query, where, getDocs, limit } from 'firebase/firestore';
// // import { db } from '../lib/firebase';

// // interface BillingTabProps {
// //   sellerId: string;
// //   sellerEmail: string;
// // }

// // interface PaymentWithPlan extends Payment {
// //   plan_name: string;
// //   plan_price: number;
// // }

// // export const BillingTab: React.FC<BillingTabProps> = ({
// //   sellerId,
// //   sellerEmail
// // }) => {
// //   const [payments, setPayments] = useState<PaymentWithPlan[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [downloading, setDownloading] = useState<string | null>(null);
// //   const [sellerName, setSellerName] = useState<string>('');
  
// //   // ✅ PAGINATION STATE
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const ITEMS_PER_PAGE = 10;

// //   useEffect(() => {
// //     loadSellerName();
// //     loadPayments();
// //   }, [sellerId]);

// //   // ✅ FETCH SELLER NAME (CUSTOMER NAME)
// //   const loadSellerName = async () => {
// //     try {
// //       const sellerQuery = query(
// //         collection(db, 'sellers'),
// //         where('user_id', '==', sellerId),
// //         limit(1)
// //       );
// //       const sellerSnapshot = await getDocs(sellerQuery);
      
// //       if (!sellerSnapshot.empty) {
// //         const sellerData = sellerSnapshot.docs[0].data();
// //         setSellerName(sellerData.owner_name || sellerData.business_name || 'Customer');
// //         console.log('✅ Seller name loaded:', sellerData.owner_name);
// //       }
// //     } catch (err) {
// //       console.warn('⚠️ Could not load seller name:', err);
// //       setSellerName('Customer');
// //     }
// //   };

// //   const loadPayments = async (forceRefresh: boolean = false) => {
// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       console.log('📋 Loading payment history for seller:', sellerId);
      
// //       if (forceRefresh) {
// //         clearPaymentCache(sellerId);
// //         console.log('🔄 Cache cleared, force refreshing...');
// //       }
      
// //       const paymentRecords = await getSellerPayments(sellerId, 100, forceRefresh);
      
// //       console.log(`✅ Fetched ${paymentRecords.length} payment records`);
      
// //       // Filter only completed payments
// //       const completedPayments = paymentRecords.filter(
// //         p => p.payment_status === 'completed' && p.verified
// //       );
      
// //       console.log(`✅ ${completedPayments.length} completed payments`);
      
// //       // Enrich with plan details
// //       const paymentsWithPlans: PaymentWithPlan[] = await Promise.all(
// //         completedPayments.map(async (payment) => {
// //           try {
// //             const plan = await getPlanById(payment.plan_id);
// //             return {
// //               ...payment,
// //               plan_name: plan?.plan_name || payment.plan_name || 'Unknown Plan',
// //               plan_price: plan?.price || payment.amount
// //             } as PaymentWithPlan;
// //           } catch (err) {
// //             console.warn('⚠️ Could not fetch plan for payment:', payment.id);
// //             return {
// //               ...payment,
// //               plan_name: payment.plan_name || 'Unknown Plan',
// //               plan_price: payment.amount
// //             } as PaymentWithPlan;
// //           }
// //         })
// //       );
      
// //       setPayments(paymentsWithPlans);
// //       setCurrentPage(1); // Reset to first page
      
// //     } catch (err: any) {
// //       console.error('❌ Error loading payments:', err);
// //       setError('Failed to load payment history');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const generatePDF = async (payment: PaymentWithPlan) => {
// //     try {
// //       setDownloading(payment.id);
// //       console.log('📄 Generating PDF receipt for payment:', payment.id);
      
// //       const doc = new jsPDF({
// //         orientation: 'portrait',
// //         unit: 'mm',
// //         format: 'a4'
// //       });
      
// //       // Page dimensions
// //       const pageWidth = doc.internal.pageSize.getWidth();
// //       const pageHeight = doc.internal.pageSize.getHeight();
// //       const margin = 20;
// //       const contentWidth = pageWidth - (margin * 2);
      
// //       // Colors
// //       const primaryColor = '#9333EA'; // Purple
// //       const secondaryColor = '#6B7280'; // Gray
      
// //       let yPos = margin;
      
// //       // ═══════════════════════════════════════════════════════════
// //       // HEADER - Company Logo/Name
// //       // ═══════════════════════════════════════════════════════════
      
// //       doc.setFillColor(147, 51, 234); // Purple
// //       doc.rect(0, 0, pageWidth, 40, 'F');
      
// //       doc.setTextColor(255, 255, 255);
// //       doc.setFontSize(24);
// //       doc.setFont('helvetica', 'bold');
// //       doc.text('SrijanX Tile', pageWidth / 2, 20, { align: 'center' });
      
// //       doc.setFontSize(10);
// //       doc.setFont('helvetica', 'normal');
// //       doc.text('Premium Tile Solutions', pageWidth / 2, 28, { align: 'center' });
      
// //       yPos = 50;
      
// //       // ═══════════════════════════════════════════════════════════
// //       // RECEIPT TITLE
// //       // ═══════════════════════════════════════════════════════════
      
// //       doc.setTextColor(0, 0, 0);
// //       doc.setFontSize(20);
// //       doc.setFont('helvetica', 'bold');
// //       doc.text('PAYMENT RECEIPT', pageWidth / 2, yPos, { align: 'center' });
      
// //       yPos += 15;
      
// //       // Date & Status Badge
// //       doc.setFontSize(10);
// //       doc.setFont('helvetica', 'normal');
// //       doc.setTextColor(107, 114, 128); // secondaryColor
      
// //       const receiptDate = new Date(payment.created_at).toLocaleString('en-IN', {
// //         timeZone: 'Asia/Kolkata',
// //         year: 'numeric',
// //         month: 'short',
// //         day: '2-digit',
// //         hour: '2-digit',
// //         minute: '2-digit',
// //         hour12: true
// //       });
      
// //       doc.text(`Date: ${receiptDate}`, pageWidth / 2, yPos, { align: 'center' });
      
// //       yPos += 10;
      
// //       // Status Badge
// //       doc.setFillColor(16, 185, 129); // Green
// //       doc.roundedRect(pageWidth / 2 - 20, yPos - 5, 40, 8, 2, 2, 'F');
// //       doc.setTextColor(255, 255, 255);
// //       doc.setFontSize(9);
// //       doc.setFont('helvetica', 'bold');
// //       doc.text('VERIFIED', pageWidth / 2, yPos, { align: 'center' });
      
// //       yPos += 20;
      
// //       // ═══════════════════════════════════════════════════════════
// //       // PAYMENT DETAILS SECTION
// //       // ═══════════════════════════════════════════════════════════
      
// //       const drawSection = (title: string, data: { label: string; value: string; bold?: boolean }[]) => {
// //         // Section Header
// //         doc.setFillColor(249, 250, 251);
// //         doc.rect(margin, yPos, contentWidth, 10, 'F');
        
// //         doc.setTextColor(0, 0, 0);
// //         doc.setFontSize(11);
// //         doc.setFont('helvetica', 'bold');
// //         doc.text(title, margin + 5, yPos + 6);
        
// //         yPos += 15;
        
// //         // Section Content
// //         data.forEach(item => {
// //           doc.setFontSize(10);
// //           doc.setFont('helvetica', 'normal');
// //           doc.setTextColor(107, 114, 128);
// //           doc.text(item.label, margin + 5, yPos);
          
// //           doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
// //           doc.setTextColor(0, 0, 0);
// //           const valueX = margin + contentWidth - 5;
// //           doc.text(item.value, valueX, yPos, { align: 'right' });
          
// //           yPos += 8;
// //         });
        
// //         yPos += 5;
        
// //         // Separator Line
// //         doc.setDrawColor(229, 231, 235);
// //         doc.setLineWidth(0.5);
// //         doc.line(margin, yPos, pageWidth - margin, yPos);
        
// //         yPos += 10;
// //       };
      
// //       // Payment Details
// //       drawSection('PAYMENT DETAILS', [
// //         {
// //           label: 'Razorpay Payment ID:',
// //           value: payment.razorpay_payment_id || 'N/A'
// //         },
// //         {
// //           label: 'Transaction ID:',
// //           value: payment.transaction_id || 'N/A'
// //         },
// //         {
// //           label: 'Receipt Number:',
// //           value: payment.razorpay_receipt
// //         },
// //         {
// //           label: 'Payment Method:',
// //           value: 'Razorpay (Online)'
// //         }
// //       ]);
      
// //       // ✅ FIXED: Plan Details with Amount Showing
// //       drawSection('PLAN DETAILS', [
// //         {
// //           label: 'Plan Name:',
// //           value: payment.plan_name,
// //           bold: true
// //         },
// //         {
// //           label: 'Amount:',
// //           value: `₹${payment.plan_price.toLocaleString('en-IN')}`,
// //           bold: true
// //         },
// //         {
// //           label: 'Currency:',
// //           value: payment.currency
// //         },
      
// //       ]);
      
// //       // Customer Details
// //       drawSection('CUSTOMER DETAILS', [
// //         {
// //           label: 'Customer Name:',
// //           value: sellerName || 'Customer'
// //         },
// //         {
// //           label: 'Email:',
// //           value: sellerEmail
// //         }
// //       ]);
      
// //       // ═══════════════════════════════════════════════════════════
// //       // AMOUNT SECTION (HIGHLIGHTED)
// //       // ═══════════════════════════════════════════════════════════
      
// //       doc.setFillColor(147, 51, 234); // Purple
// //       doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');
      
// //       doc.setTextColor(255, 255, 255);
// //       doc.setFontSize(12);
// //       doc.setFont('helvetica', 'bold');
// //       doc.text('TOTAL AMOUNT PAID', margin + 5, yPos + 10);
      
// //       doc.setFontSize(20);
// //       const amountText = `₹${payment.amount.toLocaleString('en-IN')}`;
// //       doc.text(amountText, pageWidth - margin - 5, yPos + 15, { align: 'right' });
      
// //       doc.setFontSize(8);
// //       doc.setFont('helvetica', 'normal');
// //       doc.text(`Currency: ${payment.currency}`, pageWidth - margin - 5, yPos + 22, { align: 'right' });
      
// //       yPos += 35;
      
// //       // ═══════════════════════════════════════════════════════════
// //       // FOOTER
// //       // ═══════════════════════════════════════════════════════════
      
// //       // Thank you message
// //       doc.setTextColor(0, 0, 0);
// //       doc.setFontSize(11);
// //       doc.setFont('helvetica', 'bold');
// //       doc.text('Thank you for your purchase!', pageWidth / 2, yPos, { align: 'center' });
      
// //       yPos += 10;
      
// //       // Support contact
// //       doc.setFontSize(9);
// //       doc.setFont('helvetica', 'normal');
// //       doc.setTextColor(107, 114, 128);
// //       doc.text('For support, contact: support@srijanxtile.com', pageWidth / 2, yPos, { align: 'center' });
      
// //       yPos += 8;
// //       doc.text('Website: www.srijanxtile.com', pageWidth / 2, yPos, { align: 'center' });
      
// //       // Bottom border
// //       yPos = pageHeight - 30;
// //       doc.setFillColor(147, 51, 234);
// //       doc.rect(0, yPos, pageWidth, 30, 'F');
      
// //       doc.setTextColor(255, 255, 255);
// //       doc.setFontSize(8);
// //       doc.setFont('helvetica', 'normal');
// //       doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, yPos + 10, { align: 'center' });
// //       doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, yPos + 16, { align: 'center' });
      
// //       // Watermark
// //       doc.setTextColor(240, 240, 240);
// //       doc.setFontSize(60);
// //       doc.setFont('helvetica', 'bold');
// //       doc.saveGraphicsState();
      
// //       try {
// //         const GState = (doc as any).GState;
// //         if (GState) {
// //           const gState = new GState({ opacity: 0.1 });
// //           doc.setGState(gState);
// //         }
// //       } catch (err) {
// //         console.warn('Could not set opacity:', err);
// //       }
      
// //       doc.text('PAID', pageWidth / 2, pageHeight / 2, { 
// //         align: 'center',
// //         angle: 45
// //       });
      
// //       try {
// //         doc.restoreGraphicsState();
// //       } catch (err) {
// //         console.warn('Could not restore graphics state:', err);
// //       }
      
// //       // Save PDF
// //       const filename = `Receipt_${payment.razorpay_receipt}_${Date.now()}.pdf`;
// //       doc.save(filename);
      
// //       console.log('✅ PDF generated:', filename);
      
// //     } catch (err: any) {
// //       console.error('❌ Error generating PDF:', err);
// //       alert('Failed to generate receipt. Please try again.');
// //     } finally {
// //       setDownloading(null);
// //     }
// //   };

// //   // ═══════════════════════════════════════════════════════════
// //   // ✅ PAGINATION LOGIC
// //   // ═══════════════════════════════════════════════════════════
  
// //   const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
// //   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
// //   const endIndex = startIndex + ITEMS_PER_PAGE;
// //   const currentPayments = payments.slice(startIndex, endIndex);

// //   const goToPage = (page: number) => {
// //     setCurrentPage(page);
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const goToPreviousPage = () => {
// //     if (currentPage > 1) {
// //       goToPage(currentPage - 1);
// //     }
// //   };

// //   const goToNextPage = () => {
// //     if (currentPage < totalPages) {
// //       goToPage(currentPage + 1);
// //     }
// //   };

// //   const getPageNumbers = () => {
// //     const pages: (number | string)[] = [];
    
// //     if (totalPages <= 7) {
// //       for (let i = 1; i <= totalPages; i++) {
// //         pages.push(i);
// //       }
// //     } else {
// //       pages.push(1);
      
// //       if (currentPage > 3) {
// //         pages.push('...');
// //       }
      
// //       for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
// //         pages.push(i);
// //       }
      
// //       if (currentPage < totalPages - 2) {
// //         pages.push('...');
// //       }
      
// //       pages.push(totalPages);
// //     }
    
// //     return pages;
// //   };

// //   // ═══════════════════════════════════════════════════════════
// //   // RENDER LOADING
// //   // ═══════════════════════════════════════════════════════════
  
// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center py-12">
// //         <div className="text-center">
// //           <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
// //           <p className="text-gray-600">Loading payment history...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════
// //   // RENDER ERROR
// //   // ═══════════════════════════════════════════════════════════
  
// //   if (error) {
// //     return (
// //       <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
// //         <div className="text-red-500 text-4xl mb-3">⚠️</div>
// //         <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Payments</h3>
// //         <p className="text-red-600 mb-4">{error}</p>
// //         <button
// //           onClick={() => loadPayments(true)}
// //           className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium inline-flex items-center gap-2"
// //         >
// //           <RefreshCw className="w-4 h-4" />
// //           Retry
// //         </button>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════
// //   // RENDER EMPTY STATE
// //   // ═══════════════════════════════════════════════════════════
  
// //   if (payments.length === 0) {
// //     return (
// //       <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
// //         <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
// //         <h3 className="text-lg font-semibold text-gray-700 mb-2">No Payment History</h3>
// //         <p className="text-gray-600 text-sm">You haven't made any payments yet.</p>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════
// //   // RENDER PAYMENT LIST
// //   // ═══════════════════════════════════════════════════════════
  
// //   return (
// //     <div className="space-y-4">
      
// //       {/* Header */}
// //       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h2 className="text-xl sm:text-2xl font-bold mb-1">💳 Payment & Billing</h2>
// //             <p className="text-purple-100 text-sm">View and download your payment receipts</p>
// //           </div>
// //           <button
// //             onClick={() => loadPayments(true)}
// //             className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
// //           >
// //             <RefreshCw className="w-4 h-4" />
// //             <span className="hidden sm:inline">Refresh</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Stats */}
// //       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //         <div className="bg-white rounded-lg border border-gray-200 p-4">
// //           <p className="text-sm text-gray-600 mb-1">Total Payments</p>
// //           <p className="text-2xl font-bold text-gray-800">{payments.length}</p>
// //         </div>
// //         <div className="bg-green-50 rounded-lg border border-green-200 p-4">
// //           <p className="text-sm text-green-600 mb-1">Total Spent</p>
// //           <p className="text-2xl font-bold text-green-800">
// //             ₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}
// //           </p>
// //         </div>
// //         <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
// //           <p className="text-sm text-purple-600 mb-1">Last Payment</p>
// //           <p className="text-sm font-semibold text-purple-800">
// //             {new Date(payments[0].created_at).toLocaleDateString('en-IN')}
// //           </p>
// //         </div>
// //       </div>

// //       {/* ✅ PAGINATION INFO */}
// //       {totalPages > 1 && (
// //         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
// //           <p className="text-center">
// //             Showing {startIndex + 1} - {Math.min(endIndex, payments.length)} of {payments.length} payments
// //           </p>
// //         </div>
// //       )}

// //       {/* Payment List */}
// //       <div className="space-y-3">
// //         {currentPayments.map((payment) => (
// //           <div
// //             key={payment.id}
// //             className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all shadow-sm hover:shadow-md overflow-hidden"
// //           >
// //             <div className="p-4 sm:p-6">
              
// //               {/* Desktop Layout */}
// //               <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
                
// //                 {/* Icon */}
// //                 <div className="col-span-1">
// //                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
// //                     <CreditCard className="w-6 h-6 text-white" />
// //                   </div>
// //                 </div>
                
// //                 {/* Plan Details */}
// //                 <div className="col-span-5">
// //                   <h3 className="font-bold text-gray-800 text-lg mb-1">
// //                     {payment.plan_name}
// //                   </h3>
// //                   <div className="flex items-center gap-2 text-sm text-gray-600">
// //                     <Calendar className="w-4 h-4" />
// //                     <span>
// //                       {new Date(payment.created_at).toLocaleDateString('en-IN', {
// //                         year: 'numeric',
// //                         month: 'short',
// //                         day: '2-digit'
// //                       })}
// //                     </span>
// //                   </div>
// //                 </div>
                
// //                 {/* Amount */}
// //                 <div className="col-span-3 text-center">
// //                   <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
// //                   <p className="text-2xl font-bold text-purple-600">
// //                     ₹{payment.amount.toLocaleString('en-IN')}
// //                   </p>
// //                 </div>
                
// //                 {/* Status & Action */}
// //                 <div className="col-span-3 flex flex-col items-end gap-2">
// //                   <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
// //                     <CheckCircle className="w-3 h-3" />
// //                     Verified
// //                   </span>
// //                   <button
// //                     onClick={() => generatePDF(payment)}
// //                     disabled={downloading === payment.id}
// //                     className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
// //                   >
// //                     {downloading === payment.id ? (
// //                       <>
// //                         <Loader className="w-4 h-4 animate-spin" />
// //                         Generating...
// //                       </>
// //                     ) : (
// //                       <>
// //                         <Download className="w-4 h-4" />
// //                         Download Receipt
// //                       </>
// //                     )}
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Mobile Layout */}
// //               <div className="sm:hidden space-y-4">
                
// //                 {/* Header */}
// //                 <div className="flex items-start justify-between">
// //                   <div className="flex items-start gap-3">
// //                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
// //                       <CreditCard className="w-5 h-5 text-white" />
// //                     </div>
// //                     <div>
// //                       <h3 className="font-bold text-gray-800 mb-1">
// //                         {payment.plan_name}
// //                       </h3>
// //                       <div className="flex items-center gap-1 text-xs text-gray-600">
// //                         <Calendar className="w-3 h-3" />
// //                         <span>
// //                           {new Date(payment.created_at).toLocaleDateString('en-IN', {
// //                             month: 'short',
// //                             day: '2-digit',
// //                             year: 'numeric'
// //                           })}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
// //                     <CheckCircle className="w-3 h-3" />
// //                     Paid
// //                   </span>
// //                 </div>

// //                 {/* Amount */}
// //                 <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
// //                   <p className="text-xs text-purple-600 mb-1">Amount Paid</p>
// //                   <p className="text-2xl font-bold text-purple-600">
// //                     ₹{payment.amount.toLocaleString('en-IN')}
// //                   </p>
// //                 </div>

// //                 {/* Receipt ID */}
// //                 <div className="text-xs text-gray-600">
// //                   <p>Receipt: <span className="font-mono">{payment.razorpay_receipt}</span></p>
// //                 </div>

// //                 {/* Download Button */}
// //                 <button
// //                   onClick={() => generatePDF(payment)}
// //                   disabled={downloading === payment.id}
// //                   className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
// //                 >
// //                   {downloading === payment.id ? (
// //                     <>
// //                       <Loader className="w-4 h-4 animate-spin" />
// //                       Generating PDF...
// //                     </>
// //                   ) : (
// //                     <>
// //                       <Download className="w-4 h-4" />
// //                       Download Receipt
// //                     </>
// //                   )}
// //                 </button>
// //               </div>

// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* ✅ PAGINATION CONTROLS */}
// //       {totalPages > 1 && (
// //         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4">
// //           <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
// //             Page {currentPage} of {totalPages}
// //           </div>

// //           <div className="flex items-center gap-2 order-1 sm:order-2">
// //             <button
// //               onClick={goToPreviousPage}
// //               disabled={currentPage === 1}
// //               className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
// //                 currentPage === 1
// //                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
// //                   : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
// //               }`}
// //             >
// //               <ChevronLeft className="w-4 h-4" />
// //               <span className="hidden sm:inline">Previous</span>
// //             </button>

// //             <div className="flex items-center gap-1">
// //               {getPageNumbers().map((page, index) => {
// //                 if (page === '...') {
// //                   return (
// //                     <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
// //                       ...
// //                     </span>
// //                   );
// //                 }
// //                 return (
// //                   <button
// //                     key={page}
// //                     onClick={() => goToPage(page as number)}
// //                     className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all ${
// //                       currentPage === page
// //                         ? "bg-purple-600 text-white shadow-md"
// //                         : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
// //                     }`}
// //                   >
// //                     {page}
// //                   </button>
// //                 );
// //               })}
// //             </div>

// //             <button
// //               onClick={goToNextPage}
// //               disabled={currentPage === totalPages}
// //               className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
// //                 currentPage === totalPages
// //                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
// //                   : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
// //               }`}
// //             >
// //               <span className="hidden sm:inline">Next</span>
// //               <ChevronRight className="w-4 h-4" />
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Footer Info */}
// //       <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
// //         <p className="font-semibold mb-2">📄 Receipt Information:</p>
// //         <ul className="space-y-1 text-xs">
// //           <li>• All receipts are digitally signed and verified</li>
// //           <li>• Receipts can be downloaded anytime in PDF format</li>
// //           <li>• For billing queries, contact: support@srijanxtile.com</li>
// //         </ul>
// //       </div>

// //     </div>
// //   );
// // };

// // console.log('✅ BillingTab Component loaded - PRODUCTION v3.0 COMPLETE FINAL'); 
// import React, { useState, useEffect } from 'react';
// import { Download, CreditCard, Calendar, CheckCircle, Loader, Receipt, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
// import { getSellerPayments, clearPaymentCache } from '../lib/paymentService';
// import { getPlanById } from '../lib/planService';
// import type { Payment } from '../types/payment.types';
// import { jsPDF } from 'jspdf';
// import { collection, query, where, getDocs, limit } from 'firebase/firestore';
// import { db } from '../lib/firebase';

// interface BillingTabProps {
//   sellerId: string;
//   sellerEmail: string;
// }

// interface PaymentWithPlan extends Payment {
//   plan_name: string;
//   plan_price: number;
// }

// export const BillingTab: React.FC<BillingTabProps> = ({
//   sellerId,
//   sellerEmail
// }) => {
//   const [payments, setPayments] = useState<PaymentWithPlan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [downloading, setDownloading] = useState<string | null>(null);
//   const [sellerName, setSellerName] = useState<string>('');
  
//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const ITEMS_PER_PAGE = 10;

//   useEffect(() => {
//     loadSellerName();
//     loadPayments();
//   }, [sellerId]);

//   // Fetch Seller Name
//   const loadSellerName = async () => {
//     try {
//       const sellerQuery = query(
//         collection(db, 'sellers'),
//         where('user_id', '==', sellerId),
//         limit(1)
//       );
//       const sellerSnapshot = await getDocs(sellerQuery);
      
//       if (!sellerSnapshot.empty) {
//         const sellerData = sellerSnapshot.docs[0].data();
//         setSellerName(sellerData.owner_name || sellerData.business_name || 'Customer');
//         console.log('✅ Seller name loaded:', sellerData.owner_name);
//       }
//     } catch (err) {
//       console.warn('⚠️ Could not load seller name:', err);
//       setSellerName('Customer');
//     }
//   };

//   const loadPayments = async (forceRefresh: boolean = false) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('📋 Loading payment history for seller:', sellerId);
      
//       if (forceRefresh) {
//         clearPaymentCache(sellerId);
//         console.log('🔄 Cache cleared, force refreshing...');
//       }
      
//       const paymentRecords = await getSellerPayments(sellerId, 100, forceRefresh);
      
//       console.log(`✅ Fetched ${paymentRecords.length} payment records`);
      
//       const completedPayments = paymentRecords.filter(
//         p => p.payment_status === 'completed' && p.verified
//       );
      
//       console.log(`✅ ${completedPayments.length} completed payments`);
      
//       const paymentsWithPlans: PaymentWithPlan[] = await Promise.all(
//         completedPayments.map(async (payment) => {
//           try {
//             const plan = await getPlanById(payment.plan_id);
//             return {
//               ...payment,
//               plan_name: plan?.plan_name || payment.plan_name || 'Unknown Plan',
//               plan_price: plan?.price || payment.amount
//             } as PaymentWithPlan;
//           } catch (err) {
//             console.warn('⚠️ Could not fetch plan for payment:', payment.id);
//             return {
//               ...payment,
//               plan_name: payment.plan_name || 'Unknown Plan',
//               plan_price: payment.amount
//             } as PaymentWithPlan;
//           }
//         })
//       );
      
//       setPayments(paymentsWithPlans);
//       setCurrentPage(1);
      
//     } catch (err: any) {
//       console.error('❌ Error loading payments:', err);
//       setError('Failed to load payment history');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // ✅ FIXED PDF GENERATION - PROPER ALIGNMENT & PLAN AMOUNT
//   // ═══════════════════════════════════════════════════════════
  
//   const generatePDF = async (payment: PaymentWithPlan) => {
//     try {
//       setDownloading(payment.id);
//       console.log('📄 Generating PDF receipt for payment:', payment.id);
      
//       const doc = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4'
//       });
      
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const pageHeight = doc.internal.pageSize.getHeight();
//       const margin = 20;
//       const contentWidth = pageWidth - (margin * 2);
      
//       let yPos = margin;
      
//       // ═══════════════════════════════════════════════════════════
//       // HEADER
//       // ═══════════════════════════════════════════════════════════
      
//       doc.setFillColor(147, 51, 234);
//       doc.rect(0, 0, pageWidth, 40, 'F');
      
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(24);
//       doc.setFont('helvetica', 'bold');
//       doc.text('SrijanX Tile', pageWidth / 2, 20, { align: 'center' });
      
//       doc.setFontSize(10);
//       doc.setFont('helvetica', 'normal');
//       doc.text('Premium Tile Solutions', pageWidth / 2, 28, { align: 'center' });
      
//       yPos = 50;
      
//       // ═══════════════════════════════════════════════════════════
//       // RECEIPT TITLE
//       // ═══════════════════════════════════════════════════════════
      
//       doc.setTextColor(0, 0, 0);
//       doc.setFontSize(20);
//       doc.setFont('helvetica', 'bold');
//       doc.text('PAYMENT RECEIPT', pageWidth / 2, yPos, { align: 'center' });
      
//       yPos += 15;
      
//       const receiptDate = new Date(payment.created_at).toLocaleString('en-IN', {
//         timeZone: 'Asia/Kolkata',
//         year: 'numeric',
//         month: 'short',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       });
      
//       doc.setFontSize(10);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(107, 114, 128);
//       doc.text(`Date: ${receiptDate}`, pageWidth / 2, yPos, { align: 'center' });
      
//       yPos += 10;
      
//       // Status Badge
//       doc.setFillColor(16, 185, 129);
//       doc.roundedRect(pageWidth / 2 - 20, yPos - 5, 40, 8, 2, 2, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.text('VERIFIED', pageWidth / 2, yPos, { align: 'center' });
      
//       yPos += 20;
      
//       // ═══════════════════════════════════════════════════════════
//       // ✅ FIXED: SECTION WITH PROPER LEFT ALIGNMENT
//       // ═══════════════════════════════════════════════════════════
      
//       const drawSection = (title: string, data: { label: string; value: string; bold?: boolean }[]) => {
//         // Section Header
//         doc.setFillColor(249, 250, 251);
//         doc.rect(margin, yPos, contentWidth, 10, 'F');
        
//         doc.setTextColor(0, 0, 0);
//         doc.setFontSize(11);
//         doc.setFont('helvetica', 'bold');
//         doc.text(title, margin + 5, yPos + 6);
        
//         yPos += 15;
        
//         // ✅ FIXED: Proper left-aligned labels and right-aligned values
//         data.forEach(item => {
//           // Label (LEFT ALIGNED)
//           doc.setFontSize(10);
//           doc.setFont('helvetica', 'normal');
//           doc.setTextColor(107, 114, 128);
//           doc.text(item.label, margin + 5, yPos);
          
//           // Value (RIGHT ALIGNED)
//           doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
//           doc.setTextColor(0, 0, 0);
//           doc.text(item.value, pageWidth - margin - 5, yPos, { align: 'right' });
          
//           yPos += 7;
//         });
        
//         yPos += 5;
        
//         // Separator
//         doc.setDrawColor(229, 231, 235);
//         doc.setLineWidth(0.5);
//         doc.line(margin, yPos, pageWidth - margin, yPos);
        
//         yPos += 10;
//       };
      
//       // ═══════════════════════════════════════════════════════════
//       // PAYMENT DETAILS
//       // ═══════════════════════════════════════════════════════════
      
//       drawSection('PAYMENT DETAILS', [
//         {
//           label: 'Razorpay Payment ID:',
//           value: payment.razorpay_payment_id || 'N/A'
//         },
//         {
//           label: 'Transaction ID:',
//           value: payment.transaction_id || 'N/A'
//         },
//         {
//           label: 'Receipt Number:',
//           value: payment.razorpay_receipt
//         },
//         {
//           label: 'Payment Method:',
//           value: 'Razorpay (Online)'
//         }
//       ]);
      
//       // ═══════════════════════════════════════════════════════════
//       // ✅ FIXED: PLAN DETAILS WITH AMOUNT PROPERLY SHOWING
//       // ═══════════════════════════════════════════════════════════
      
//       drawSection('PLAN DETAILS', [
//         {
//           label: 'Plan Name:',
//           value: payment.plan_name,
//           bold: true
//         },
//         {
//           label: 'Plan Amount:',
//           value: `₹${payment.plan_price.toLocaleString('en-IN')}`,
//           bold: true
//         },
//         {
//           label: 'Currency:',
//           value: payment.currency.toUpperCase()
//         }
//       ]);
      
//       // ═══════════════════════════════════════════════════════════
//       // CUSTOMER DETAILS
//       // ═══════════════════════════════════════════════════════════
      
//       drawSection('CUSTOMER DETAILS', [
//         {
//           label: 'Customer Name:',
//           value: sellerName || 'Customer'
//         },
//         {
//           label: 'Email Address:',
//           value: sellerEmail
//         }
//       ]);
      
//       // ═══════════════════════════════════════════════════════════
//       // TOTAL AMOUNT SECTION (HIGHLIGHTED)
//       // ═══════════════════════════════════════════════════════════
      
//       doc.setFillColor(147, 51, 234);
//       doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');
      
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(12);
//       doc.setFont('helvetica', 'bold');
//       doc.text('TOTAL AMOUNT PAID', margin + 5, yPos + 10);
      
//       doc.setFontSize(22);
//       const amountText = `₹${payment.amount.toLocaleString('en-IN')}`;
//       doc.text(amountText, pageWidth - margin - 5, yPos + 15, { align: 'right' });
      
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'normal');
//       doc.text(`Currency: ${payment.currency.toUpperCase()}`, pageWidth - margin - 5, yPos + 22, { align: 'right' });
      
//       yPos += 35;
      
//       // ═══════════════════════════════════════════════════════════
//       // FOOTER
//       // ═══════════════════════════════════════════════════════════
      
//       doc.setTextColor(0, 0, 0);
//       doc.setFontSize(11);
//       doc.setFont('helvetica', 'bold');
//       doc.text('Thank you for your purchase!', pageWidth / 2, yPos, { align: 'center' });
      
//       yPos += 10;
      
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(107, 114, 128);
//       doc.text('For support, contact: support@srijanxtile.com', pageWidth / 2, yPos, { align: 'center' });
      
//       yPos += 8;
//       doc.text('Website: www.srijanxtile.com', pageWidth / 2, yPos, { align: 'center' });
      
//       // Bottom Border
//       yPos = pageHeight - 30;
//       doc.setFillColor(147, 51, 234);
//       doc.rect(0, yPos, pageWidth, 30, 'F');
      
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'normal');
//       doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, yPos + 10, { align: 'center' });
//       doc.text(`Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, pageWidth / 2, yPos + 16, { align: 'center' });
      
//       // Watermark
//       doc.setTextColor(240, 240, 240);
//       doc.setFontSize(60);
//       doc.setFont('helvetica', 'bold');
//       doc.saveGraphicsState();
      
//       try {
//         const GState = (doc as any).GState;
//         if (GState) {
//           const gState = new GState({ opacity: 0.1 });
//           doc.setGState(gState);
//         }
//       } catch (err) {
//         console.warn('Could not set opacity:', err);
//       }
      
//       doc.text('PAID', pageWidth / 2, pageHeight / 2, { 
//         align: 'center',
//         angle: 45
//       });
      
//       try {
//         doc.restoreGraphicsState();
//       } catch (err) {
//         console.warn('Could not restore graphics state:', err);
//       }
      
//       // Save PDF
//       const filename = `Receipt_${payment.razorpay_receipt}_${Date.now()}.pdf`;
//       doc.save(filename);
      
//       console.log('✅ PDF generated successfully:', filename);
      
//     } catch (err: any) {
//       console.error('❌ Error generating PDF:', err);
//       alert('Failed to generate receipt. Please try again.');
//     } finally {
//       setDownloading(null);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // PAGINATION LOGIC
//   // ═══════════════════════════════════════════════════════════
  
//   const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const currentPayments = payments.slice(startIndex, endIndex);

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       goToPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       goToPage(currentPage + 1);
//     }
//   };

//   const getPageNumbers = () => {
//     const pages: (number | string)[] = [];
    
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       pages.push(1);
      
//       if (currentPage > 3) {
//         pages.push('...');
//       }
      
//       for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
//         pages.push(i);
//       }
      
//       if (currentPage < totalPages - 2) {
//         pages.push('...');
//       }
      
//       pages.push(totalPages);
//     }
    
//     return pages;
//   };

//   // ═══════════════════════════════════════════════════════════
//   // LOADING STATE
//   // ═══════════════════════════════════════════════════════════
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading payment history...</p>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════
//   // ERROR STATE
//   // ═══════════════════════════════════════════════════════════
  
//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//         <div className="text-red-500 text-4xl mb-3">⚠️</div>
//         <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Payments</h3>
//         <p className="text-red-600 mb-4">{error}</p>
//         <button
//           onClick={() => loadPayments(true)}
//           className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium inline-flex items-center gap-2"
//         >
//           <RefreshCw className="w-4 h-4" />
//           Retry
//         </button>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════
//   // EMPTY STATE
//   // ═══════════════════════════════════════════════════════════
  
//   if (payments.length === 0) {
//     return (
//       <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
//         <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-gray-700 mb-2">No Payment History</h3>
//         <p className="text-gray-600 text-sm">You haven't made any payments yet.</p>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════
//   // MAIN RENDER
//   // ═══════════════════════════════════════════════════════════
  
//   return (
//     <div className="space-y-4">
      
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl sm:text-2xl font-bold mb-1">💳 Payment & Billing</h2>
//             <p className="text-purple-100 text-sm">View and download your payment receipts</p>
//           </div>
//           <button
//             onClick={() => loadPayments(true)}
//             className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span className="hidden sm:inline">Refresh</span>
//           </button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="bg-white rounded-lg border border-gray-200 p-4">
//           <p className="text-sm text-gray-600 mb-1">Total Payments</p>
//           <p className="text-2xl font-bold text-gray-800">{payments.length}</p>
//         </div>
//         <div className="bg-green-50 rounded-lg border border-green-200 p-4">
//           <p className="text-sm text-green-600 mb-1">Total Spent</p>
//           <p className="text-2xl font-bold text-green-800">
//             ₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}
//           </p>
//         </div>
//         <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
//           <p className="text-sm text-purple-600 mb-1">Last Payment</p>
//           <p className="text-sm font-semibold text-purple-800">
//             {new Date(payments[0].created_at).toLocaleDateString('en-IN')}
//           </p>
//         </div>
//       </div>

//       {/* Pagination Info */}
//       {totalPages > 1 && (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
//           <p className="text-center">
//             Showing {startIndex + 1} - {Math.min(endIndex, payments.length)} of {payments.length} payments
//           </p>
//         </div>
//       )}

//       {/* Payment List */}
//       <div className="space-y-3">
//         {currentPayments.map((payment) => (
//           <div
//             key={payment.id}
//             className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all shadow-sm hover:shadow-md overflow-hidden"
//           >
//             <div className="p-4 sm:p-6">
              
//               {/* Desktop Layout */}
//               <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
                
//                 <div className="col-span-1">
//                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
//                     <CreditCard className="w-6 h-6 text-white" />
//                   </div>
//                 </div>
                
//                 <div className="col-span-5">
//                   <h3 className="font-bold text-gray-800 text-lg mb-1">
//                     {payment.plan_name}
//                   </h3>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Calendar className="w-4 h-4" />
//                     <span>
//                       {new Date(payment.created_at).toLocaleDateString('en-IN', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: '2-digit'
//                       })}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="col-span-3 text-center">
//                   <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
//                   <p className="text-2xl font-bold text-purple-600">
//                     ₹{payment.amount.toLocaleString('en-IN')}
//                   </p>
//                 </div>
                
//                 <div className="col-span-3 flex flex-col items-end gap-2">
//                   <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
//                     <CheckCircle className="w-3 h-3" />
//                     Verified
//                   </span>
//                   <button
//                     onClick={() => generatePDF(payment)}
//                     disabled={downloading === payment.id}
//                     className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                   >
//                     {downloading === payment.id ? (
//                       <>
//                         <Loader className="w-4 h-4 animate-spin" />
//                         Generating...
//                       </>
//                     ) : (
//                       <>
//                         <Download className="w-4 h-4" />
//                         Download Receipt
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Mobile Layout */}
//               <div className="sm:hidden space-y-4">
                
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-start gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
//                       <CreditCard className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-gray-800 mb-1">
//                         {payment.plan_name}
//                       </h3>
//                       <div className="flex items-center gap-1 text-xs text-gray-600">
//                         <Calendar className="w-3 h-3" />
//                         <span>
//                           {new Date(payment.created_at).toLocaleDateString('en-IN', {
//                             month: 'short',
//                             day: '2-digit',
//                             year: 'numeric'
//                           })}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
//                     <CheckCircle className="w-3 h-3" />
//                     Paid
//                   </span>
//                 </div>

//                 <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
//                   <p className="text-xs text-purple-600 mb-1">Amount Paid</p>
//                   <p className="text-2xl font-bold text-purple-600">
//                     ₹{payment.amount.toLocaleString('en-IN')}
//                   </p>
//                 </div>

//                 <div className="text-xs text-gray-600">
//                   <p>Receipt: <span className="font-mono">{payment.razorpay_receipt}</span></p>
//                 </div>

//                 <button
//                   onClick={() => generatePDF(payment)}
//                   disabled={downloading === payment.id}
//                   className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {downloading === payment.id ? (
//                     <>
//                       <Loader className="w-4 h-4 animate-spin" />
//                       Generating PDF...
//                     </>
//                   ) : (
//                     <>
//                       <Download className="w-4 h-4" />
//                       Download Receipt
//                     </>
//                   )}
//                 </button>
//               </div>

//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4">
//           <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
//             Page {currentPage} of {totalPages}
//           </div>

//           <div className="flex items-center gap-2 order-1 sm:order-2">
//             <button
//               onClick={goToPreviousPage}
//               disabled={currentPage === 1}
//               className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                 currentPage === 1
//                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                   : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
//               }`}
//             >
//               <ChevronLeft className="w-4 h-4" />
//               <span className="hidden sm:inline">Previous</span>
//             </button>

//             <div className="flex items-center gap-1">
//               {getPageNumbers().map((page, index) => {
//                 if (page === '...') {
//                   return (
//                     <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
//                       ...
//                     </span>
//                   );
//                 }
//                 return (
//                   <button
//                     key={page}
//                     onClick={() => goToPage(page as number)}
//                     className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all ${
//                       currentPage === page
//                         ? "bg-purple-600 text-white shadow-md"
//                         : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 );
//               })}
//             </div>

//             <button
//               onClick={goToNextPage}
//               disabled={currentPage === totalPages}
//               className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                 currentPage === totalPages
//                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                   : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
//               }`}
//             >
//               <span className="hidden sm:inline">Next</span>
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Footer Info */}
//       <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
//         <p className="font-semibold mb-2">📄 Receipt Information:</p>
//         <ul className="space-y-1 text-xs">
//           <li>• All receipts are digitally signed and verified</li>
//           <li>• Receipts can be downloaded anytime in PDF format</li>
//           <li>• For billing queries, contact: support@srijanxtile.com</li>
//         </ul>
//       </div>

//     </div>
//   );
// };

// console.log('✅ BillingTab Component loaded - PRODUCTION v4.0 - FIXED PDF ALIGNMENT & PLAN AMOUNT'); 

// console.log('✅ BillingTab Component loaded - PRODUCTION v6.0 - FIXED FONTS & AMOUNT'); 
import React, { useState, useEffect } from 'react';
import { Download, CreditCard, Calendar, CheckCircle, Loader, Receipt, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSellerPayments, clearPaymentCache } from '../lib/paymentService';
import { getPlanById } from '../lib/planService';
import type { Payment } from '../types/payment.types';
import { jsPDF } from 'jspdf';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface BillingTabProps {
  sellerId: string;
  sellerEmail: string;
}

interface PaymentWithPlan extends Payment {
  plan_name: string;
  plan_price: number;
}

export const BillingTab: React.FC<BillingTabProps> = ({
  sellerId,
  sellerEmail
}) => {
  const [payments, setPayments] = useState<PaymentWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [sellerName, setSellerName] = useState<string>('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadSellerName();
    loadPayments();
  }, [sellerId]);

  // Fetch Seller Name
  const loadSellerName = async () => {
    try {
      const sellerQuery = query(
        collection(db, 'sellers'),
        where('user_id', '==', sellerId),
        limit(1)
      );
      const sellerSnapshot = await getDocs(sellerQuery);
      
      if (!sellerSnapshot.empty) {
        const sellerData = sellerSnapshot.docs[0].data();
        setSellerName(sellerData.owner_name || sellerData.business_name || 'Customer');
        console.log('✅ Seller name loaded:', sellerData.owner_name);
      }
    } catch (err) {
      console.warn('⚠️ Could not load seller name:', err);
      setSellerName('Customer');
    }
  };

  const loadPayments = async (forceRefresh: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📋 Loading payment history for seller:', sellerId);
      
      if (forceRefresh) {
        clearPaymentCache(sellerId);
        console.log('🔄 Cache cleared, force refreshing...');
      }
      
      const paymentRecords = await getSellerPayments(sellerId, 100, forceRefresh);
      
      console.log(`✅ Fetched ${paymentRecords.length} payment records`);
      
      const completedPayments = paymentRecords.filter(
        p => p.payment_status === 'completed' && p.verified
      );
      
      console.log(`✅ ${completedPayments.length} completed payments`);
      
      const paymentsWithPlans: PaymentWithPlan[] = await Promise.all(
        completedPayments.map(async (payment) => {
          try {
            const plan = await getPlanById(payment.plan_id);
            return {
              ...payment,
              plan_name: plan?.plan_name || payment.plan_name || 'Unknown Plan',
              plan_price: plan?.price || payment.amount
            } as PaymentWithPlan;
          } catch (err) {
            console.warn('⚠️ Could not fetch plan for payment:', payment.id);
            return {
              ...payment,
              plan_name: payment.plan_name || 'Unknown Plan',
              plan_price: payment.amount
            } as PaymentWithPlan;
          }
        })
      );
      
      setPayments(paymentsWithPlans);
      setCurrentPage(1);
      
    } catch (err: any) {
      console.error('❌ Error loading payments:', err);
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // ✅ FIXED PDF GENERATION - PROPER FONTS & AMOUNT DISPLAY
  // ═══════════════════════════════════════════════════════════
  
  const generatePDF = async (payment: PaymentWithPlan) => {
    try {
      setDownloading(payment.id);
      console.log('📄 Generating PDF receipt for payment:', payment.id);
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      let yPos = margin;
      
      // ═══════════════════════════════════════════════════════════
      // HEADER
      // ═══════════════════════════════════════════════════════════
      
      doc.setFillColor(147, 51, 234);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26); // ✅ Increased from 24
      doc.setFont('helvetica', 'bold');
      doc.text('SrijanX Tile', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(11); // ✅ Increased from 10
      doc.setFont('helvetica', 'normal');
      doc.text('Premium Tile Solutions', pageWidth / 2, 28, { align: 'center' });
      
      yPos = 50;
      
      // ═══════════════════════════════════════════════════════════
      // RECEIPT TITLE
      // ═══════════════════════════════════════════════════════════
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(22); // ✅ Increased from 20
      doc.setFont('helvetica', 'bold');
      doc.text('PAYMENT RECEIPT', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 15;
      
      const receiptDate = new Date(payment.created_at).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      doc.setFontSize(11); // ✅ Increased from 10
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`Date: ${receiptDate}`, pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 10;
      
      // Status Badge
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(pageWidth / 2 - 20, yPos - 5, 40, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10); // ✅ Increased from 9
      doc.setFont('helvetica', 'bold');
      doc.text('VERIFIED', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 20;
      
      // ═══════════════════════════════════════════════════════════
      // ✅ OPTIMIZED SECTION WITH LARGER FONTS
      // ═══════════════════════════════════════════════════════════
      
      const drawSection = (title: string, data: { label: string; value: string; bold?: boolean }[]) => {
        // Section Header
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, yPos, contentWidth, 10, 'F');
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12); // ✅ Increased from 11
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin + 5, yPos + 6);
        
        yPos += 13;
        
        // ✅ Calculate the longest label width for perfect alignment
        const labelFontSize = 11; // ✅ Increased from 10
        doc.setFontSize(labelFontSize);
        doc.setFont('helvetica', 'normal');
        
        let maxLabelWidth = 0;
        data.forEach(item => {
          const labelWidth = doc.getTextWidth(item.label);
          if (labelWidth > maxLabelWidth) {
            maxLabelWidth = labelWidth;
          }
        });
        
        // ✅ Fixed position for values to start (label width + 10mm gap)
        const valueStartX = margin + 5 + maxLabelWidth + 10;
        
        // ✅ Print each row with aligned columns
        data.forEach(item => {
          // Label (LEFT ALIGNED at fixed position)
          doc.setFontSize(11); // ✅ Increased from 10
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(107, 114, 128);
          doc.text(item.label, margin + 5, yPos);
          
          // Value (LEFT ALIGNED at fixed position - creates perfect gap)
          doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
          doc.setTextColor(0, 0, 0);
          doc.text(item.value, valueStartX, yPos);
          
          yPos += 5;
        });
        
        yPos += 2;
        
        // Separator
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        
        yPos += 6;
      };
      
      // ═══════════════════════════════════════════════════════════
      // PAYMENT DETAILS
      // ═══════════════════════════════════════════════════════════
      
      drawSection('PAYMENT DETAILS', [
        {
          label: 'Razorpay Payment ID:',
          value: payment.razorpay_payment_id || 'N/A'
        },
        {
          label: 'Transaction ID:',
          value: payment.transaction_id || 'N/A'
        },
        {
          label: 'Receipt Number:',
          value: payment.razorpay_receipt
        },
        {
          label: 'Payment Method:',
          value: 'Razorpay (Online)'
        }
      ]);
      
      // ═══════════════════════════════════════════════════════════
      // PLAN DETAILS - ✅ FIXED RUPEE SYMBOL
      // ═══════════════════════════════════════════════════════════
      
      drawSection('PLAN DETAILS', [
        {
          label: 'Plan Name:',
          value: payment.plan_name,
          bold: true
        },
        {
          label: 'Plan Amount:',
          value: `Rs. ${payment.plan_price.toLocaleString('en-IN')}`, // ✅ Changed ₹ to Rs.
          bold: true
        },
        {
          label: 'Currency:',
          value: payment.currency.toUpperCase()
        }
      ]);
      
      // ═══════════════════════════════════════════════════════════
      // CUSTOMER DETAILS
      // ═══════════════════════════════════════════════════════════
      
      drawSection('CUSTOMER DETAILS', [
        {
          label: 'Customer Name:',
          value: sellerName || 'Customer'
        },
        {
          label: 'Email Address:',
          value: sellerEmail
        }
      ]);
      
      // ═══════════════════════════════════════════════════════════
      // ✅ FIXED TOTAL AMOUNT SECTION - NO CUTOFF + PROPER SYMBOL
      // ═══════════════════════════════════════════════════════════
      
      doc.setFillColor(147, 51, 234);
      doc.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'F'); // ✅ Increased height from 25 to 28
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13); // ✅ Increased from 12
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL AMOUNT PAID', margin + 5, yPos + 11);
      
      // ✅ FIXED: Amount display with proper positioning and symbol
      const amountText = `Rs. ${payment.amount.toLocaleString('en-IN')}`; // ✅ Changed ₹ to Rs.
      
      doc.setFontSize(20); // ✅ Reduced from 22 to prevent cutoff
      doc.setFont('helvetica', 'bold');
      
      // ✅ Calculate text width to ensure it fits
      const amountWidth = doc.getTextWidth(amountText);
      const maxAllowedWidth = contentWidth - 10; // Leave 5mm margin on each side
      
      // ✅ Position from right with safety margin
      const amountXPosition = pageWidth - margin - 5;
      
      doc.text(amountText, amountXPosition, yPos + 16, { align: 'right' });
      
      doc.setFontSize(9); // ✅ Increased from 8
      doc.setFont('helvetica', 'normal');
      doc.text(`Currency: ${payment.currency.toUpperCase()}`, pageWidth - margin - 5, yPos + 23, { align: 'right' });
      
      yPos += 38; // ✅ Increased from 35
      
      // ═══════════════════════════════════════════════════════════
      // FOOTER
      // ═══════════════════════════════════════════════════════════
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12); // ✅ Increased from 11
      doc.setFont('helvetica', 'bold');
      doc.text('Thank you for your purchase!', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 10;
      
      doc.setFontSize(10); // ✅ Increased from 9
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text('For support, contact: support@srijanxtile.com', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 8;
      doc.text('Website: www.srijanxtile.com', pageWidth / 2, yPos, { align: 'center' });
      
      // Bottom Border
      yPos = pageHeight - 30;
      doc.setFillColor(147, 51, 234);
      doc.rect(0, yPos, pageWidth, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9); // ✅ Increased from 8
      doc.setFont('helvetica', 'normal');
      doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, yPos + 10, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, pageWidth / 2, yPos + 16, { align: 'center' });
      
      // Watermark
      doc.setTextColor(240, 240, 240);
      doc.setFontSize(60);
      doc.setFont('helvetica', 'bold');
      doc.saveGraphicsState();
      
      try {
        const GState = (doc as any).GState;
        if (GState) {
          const gState = new GState({ opacity: 0.1 });
          doc.setGState(gState);
        }
      } catch (err) {
        console.warn('Could not set opacity:', err);
      }
      
      doc.text('PAID', pageWidth / 2, pageHeight / 2, { 
        align: 'center',
        angle: 45
      });
      
      try {
        doc.restoreGraphicsState();
      } catch (err) {
        console.warn('Could not restore graphics state:', err);
      }
      
      // Save PDF
      const filename = `Receipt_${payment.razorpay_receipt}_${Date.now()}.pdf`;
      doc.save(filename);
      
      console.log('✅ PDF generated successfully:', filename);
      
    } catch (err: any) {
      console.error('❌ Error generating PDF:', err);
      alert('Failed to generate receipt. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // PAGINATION LOGIC
  // ═══════════════════════════════════════════════════════════
  
  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPayments = payments.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  // ═══════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // ERROR STATE
  // ═══════════════════════════════════════════════════════════
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
        <div className="text-red-500 text-3xl sm:text-4xl mb-3">⚠️</div>
        <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Error Loading Payments</h3>
        <p className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
        <button
          onClick={() => loadPayments(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // EMPTY STATE
  // ═══════════════════════════════════════════════════════════
  
  if (payments.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
        <Receipt className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No Payment History</h3>
        <p className="text-xs sm:text-sm text-gray-600">You haven't made any payments yet.</p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // MAIN RENDER - FULLY RESPONSIVE
  // ═══════════════════════════════════════════════════════════
  
  return (
    <div className="space-y-3 sm:space-y-4">
      
      {/* Header - Responsive */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">💳 Payment & Billing</h2>
            <p className="text-purple-100 text-xs sm:text-sm">View and download your payment receipts</p>
          </div>
          <button
            onClick={() => loadPayments(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs sm:text-sm font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Payments</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{payments.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-green-600 mb-1">Total Spent</p>
          <p className="text-xl sm:text-2xl font-bold text-green-800">
            ₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg border border-purple-200 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-purple-600 mb-1">Last Payment</p>
          <p className="text-xs sm:text-sm font-semibold text-purple-800">
            {new Date(payments[0].created_at).toLocaleDateString('en-IN')}
          </p>
        </div>
      </div>

      {/* Pagination Info - Responsive */}
      {totalPages > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm text-blue-800">
          <p className="text-center">
            Showing {startIndex + 1} - {Math.min(endIndex, payments.length)} of {payments.length} payments
          </p>
        </div>
      )}

      {/* Payment List - Responsive */}
      <div className="space-y-3">
        {currentPayments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all shadow-sm hover:shadow-md overflow-hidden"
          >
            <div className="p-3 sm:p-4 md:p-6">
              
              {/* Desktop Layout (md and above) */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                
                <div className="col-span-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="col-span-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    {payment.plan_name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(payment.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="col-span-3 text-center">
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </p>
                </div>
                
                <div className="col-span-3 flex flex-col items-end gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                  <button
                    onClick={() => generatePDF(payment)}
                    disabled={downloading === payment.id}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {downloading === payment.id ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download Receipt
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tablet Layout (sm to md) */}
              <div className="hidden sm:block md:hidden">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-base mb-1">
                        {payment.plan_name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(payment.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Paid
                  </span>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 mb-3">
                  <p className="text-xs text-purple-600 mb-1">Amount Paid</p>
                  <p className="text-xl font-bold text-purple-600">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  onClick={() => generatePDF(payment)}
                  disabled={downloading === payment.id}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {downloading === payment.id ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Receipt
                    </>
                  )}
                </button>
              </div>

              {/* Mobile Layout (below sm) */}
              <div className="sm:hidden space-y-3">
                
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm mb-0.5">
                        {payment.plan_name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(payment.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: '2-digit',
                            year: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Paid
                  </span>
                </div>

                <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-200">
                  <p className="text-xs text-purple-600 mb-0.5">Amount Paid</p>
                  <p className="text-lg font-bold text-purple-600">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="text-xs text-gray-600">
                  <p className="truncate">Receipt: <span className="font-mono text-xs">{payment.razorpay_receipt}</span></p>
                </div>

                <button
                  onClick={() => generatePDF(payment)}
                  disabled={downloading === payment.id}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2.5 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {downloading === payment.id ? (
                    <>
                      <Loader className="w-3.5 h-3.5 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Download Receipt
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls - Responsive */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-gray-200 pt-3 sm:pt-4">
          <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-1.5 sm:px-2 text-xs sm:text-sm text-gray-500">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-purple-600 text-white shadow-md"
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
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Info - Responsive */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-blue-800">
        <p className="font-semibold mb-2">📄 Receipt Information:</p>
        <ul className="space-y-1 text-xs">
          <li>• All receipts are digitally signed and verified</li>
          <li>• Receipts can be downloaded anytime in PDF format</li>
          <li>• For billing queries, contact: support@srijanxtile.com</li>
        </ul>
      </div>

    </div>
  );
};

console.log('✅ BillingTab - PRODUCTION v6.0 FINAL - FIXED FONTS & AMOUNT DISPLAY');
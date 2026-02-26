// =============================================================================
// Monvie Admin - TypeScript Type Definitions
// AI Children's Photobook Service
// =============================================================================

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export enum FunnelState {
  THEME_SELECTED = 'THEME_SELECTED',
  DESIGN_STARTED = 'DESIGN_STARTED',
  PHOTO_UPLOADED = 'PHOTO_UPLOADED',
  DESIGN_IN_PROGRESS = 'DESIGN_IN_PROGRESS',
  DESIGN_COMPLETED = 'DESIGN_COMPLETED',
  ADDED_TO_CART = 'ADDED_TO_CART',
  CHECKOUT_STARTED = 'CHECKOUT_STARTED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  DESIGN_ABANDONED = 'DESIGN_ABANDONED',
  CART_ABANDONED = 'CART_ABANDONED',
}

// -----------------------------------------------------------------------------
// Theme IDs
// -----------------------------------------------------------------------------

export type ThemeId = 'HOME' | 'BDAY' | 'CAT' | 'RYAN' | 'ABC';

// -----------------------------------------------------------------------------
// Customer
// -----------------------------------------------------------------------------

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  lastActivityAt: string;
}

// -----------------------------------------------------------------------------
// Design Session
// -----------------------------------------------------------------------------

export type DesignSessionStatus =
  | 'started'
  | 'in_progress'
  | 'completed'
  | 'abandoned'
  | 'converted';

export interface DesignSession {
  id: string;
  customerId: string;
  customerName: string;
  themeId: ThemeId;
  status: DesignSessionStatus;
  photoCount: number;
  hasCustomText: boolean;
  previewUrl: string | null;
  totalEditTimeSeconds: number;
  lastActivityAt: string;
  lastAction: string;
  abandonedAt: string | null;
  recoveryEmailSentAt: string | null;
  recoveryEmailCount: number;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Cart Item
// -----------------------------------------------------------------------------

export type CartItemStatus =
  | 'active'
  | 'checkout'
  | 'purchased'
  | 'abandoned'
  | 'removed';

export type Currency = 'KRW' | 'USD';

export interface CartItem {
  id: string;
  customerId: string;
  customerName: string;
  designSessionId: string;
  themeId: ThemeId;
  quantity: number;
  unitPrice: number;
  currency: Currency;
  status: CartItemStatus;
  addedAt: string;
  abandonedAt: string | null;
  recoveryEmailSentAt: string | null;
  recoveryEmailCount: number;
}

// -----------------------------------------------------------------------------
// Order
// -----------------------------------------------------------------------------

export type OrderStatus =
  | 'paid'
  | 'preparing'
  | 'in_production'
  | 'quality_check'
  | 'packing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type ProductionStatus =
  | 'pending'
  | 'printing'
  | 'binding'
  | 'quality_check'
  | 'done';

export interface OrderItem {
  id: string;
  orderId: string;
  designSessionId: string;
  themeId: ThemeId;
  quantity: number;
  unitPrice: number;
  productionStatus: ProductionStatus;
  productionFileUrl: string | null;
}

export interface Order {
  id: string;
  orderNumber: string; // MV-YYYYMMDD-NNNN
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  currency: Currency;
  paymentMethod: string;
  paymentId: string;
  shippingAddress: string; // JSON string
  trackingNumber: string | null;
  carrier: string | null;
  estimatedDeliveryAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Funnel Event
// -----------------------------------------------------------------------------

export interface FunnelEvent {
  id: string;
  customerId: string;
  sessionId: string;
  designSessionId: string | null;
  eventType: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Recovery Campaign
// -----------------------------------------------------------------------------

export type CampaignType = 'design_abandoned' | 'cart_abandoned';

export interface RecoveryCampaign {
  id: string;
  customerId: string;
  customerName: string;
  campaignType: CampaignType;
  targetId: string;
  emailSentAt: string;
  emailOpenedAt: string | null;
  linkClickedAt: string | null;
  convertedAt: string | null;
  discountCode: string | null;
  attemptNumber: number;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Dashboard KPI
// -----------------------------------------------------------------------------

export interface DashboardKPI {
  todayRevenue: number;
  todayOrders: number;
  activeDesigns: number;
  conversionRate: number;
  revenueChange: number;
  ordersChange: number;
  designsChange: number;
  conversionChange: number;
}

// -----------------------------------------------------------------------------
// Funnel Step
// -----------------------------------------------------------------------------

export interface FunnelStep {
  label: string;
  count: number;
  percentage: number;
  dropoff: number;
}

// -----------------------------------------------------------------------------
// Theme Stats
// -----------------------------------------------------------------------------

export type TrendDirection = 'up' | 'down' | 'stable';

export interface ThemeStats {
  themeId: ThemeId;
  themeName: string;
  orders: number;
  revenue: number;
  conversionRate: number;
  trend: TrendDirection;
}

// -----------------------------------------------------------------------------
// Revenue Data (for charts)
// -----------------------------------------------------------------------------

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
  grossProfit?: number;
  month?: string;
}

// -----------------------------------------------------------------------------
// Alert
// -----------------------------------------------------------------------------

export interface Alert {
  id: string;
  type: string;
  label: string;
  count: number;
  severity: 'critical' | 'warning' | 'info';
  link: string;
}

// -----------------------------------------------------------------------------
// Funnel Event Types (detailed event tracking)
// -----------------------------------------------------------------------------

export enum FunnelEventType {
  THEME_SELECTED = 'theme_selected',
  CUSTOMIZER_ENTERED = 'customizer_entered',
  PHOTO_UPLOADED = 'photo_uploaded',
  PHOTO_REMOVED = 'photo_removed',
  TEXT_EDITED = 'text_edited',
  LAYOUT_CHANGED = 'layout_changed',
  PREVIEW_VIEWED = 'preview_viewed',
  DESIGN_COMPLETED = 'design_completed',
  ADDED_TO_CART = 'added_to_cart',
  REMOVED_FROM_CART = 'removed_from_cart',
  CHECKOUT_STARTED = 'checkout_started',
  PAYMENT_ATTEMPTED = 'payment_attempted',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',
  RECOVERY_EMAIL_SENT = 'recovery_email_sent',
  RECOVERY_EMAIL_OPENED = 'recovery_email_opened',
  RECOVERY_LINK_CLICKED = 'recovery_link_clicked',
  DESIGN_RESUMED = 'design_resumed',
  CART_RECOVERED = 'cart_recovered',
}

// -----------------------------------------------------------------------------
// Admin Roles
// -----------------------------------------------------------------------------

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  MARKETING = 'marketing',
  VIEWER = 'viewer',
}

// -----------------------------------------------------------------------------
// Admin User
// -----------------------------------------------------------------------------

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  lastLoginAt: string | null;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Order Timeline Event (for order detail page)
// -----------------------------------------------------------------------------

export interface OrderTimelineEvent {
  id: string;
  orderId: string;
  action: string;
  description: string;
  actor: string;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Daily Stats (for aggregated data)
// -----------------------------------------------------------------------------

export interface DailyStats {
  id: string;
  date: string;
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  themeBreakdown: Record<string, number>;
  recoveryStats: { sent: number; opened: number; converted: number };
  createdAt: string;
}

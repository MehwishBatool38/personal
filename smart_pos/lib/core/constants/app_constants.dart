class AppConstants {
  // App Info
  static const String appName = 'Smart POS';
  static const String appVersion = '1.0.0';

  // Firebase Collections
  static const String usersCollection = 'users';
  static const String productsCollection = 'products';
  static const String salesCollection = 'sales';
  static const String customersCollection = 'customers';

  // Storage Paths
  static const String backupFolder = 'SmartPOSBackups';

  // Animation Durations
  static const Duration splashDuration = Duration(seconds: 3);
  static const Duration pageTransitionDuration = Duration(milliseconds: 300);

  // Default Values
  static const double defaultTaxRate = 0.13;
  static const double defaultDiscountRate = 0.0;
}
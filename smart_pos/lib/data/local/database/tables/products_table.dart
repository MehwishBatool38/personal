class ProductsTable {
  static const String tableName = 'products';

  static const String columnId = 'id';
  static const String columnProductId = 'productId';
  static const String columnName = 'name';
  static const String columnSku = 'sku';
  static const String columnBarcode = 'barcode';
  static const String columnDescription = 'description';
  static const String columnPrice = 'price';
  static const String columnCostPrice = 'costPrice';
  static const String columnQuantity = 'quantity';
  static const String columnCategory = 'category';
  static const String columnUnit = 'unit';
  static const String columnTaxRate = 'taxRate';
  static const String columnIsTaxable = 'isTaxable';
  static const String columnLowStockThreshold = 'lowStockThreshold';
  static const String columnImageUrl = 'imageUrl';
  static const String columnCreatedAt = 'createdAt';
  static const String columnUpdatedAt = 'updatedAt';
  static const String columnIsSynced = 'isSynced';
  static const String columnIsActive = 'isActive';

  static String get createTableQuery => '''
    CREATE TABLE $tableName (
      $columnId INTEGER PRIMARY KEY AUTOINCREMENT,
      $columnProductId TEXT,
      $columnName TEXT NOT NULL,
      $columnSku TEXT NOT NULL UNIQUE,
      $columnBarcode TEXT,
      $columnDescription TEXT,
      $columnPrice REAL NOT NULL,
      $columnCostPrice REAL NOT NULL,
      $columnQuantity INTEGER NOT NULL,
      $columnCategory TEXT,
      $columnUnit TEXT,
      $columnTaxRate REAL DEFAULT 0.0,
      $columnIsTaxable INTEGER DEFAULT 1,
      $columnLowStockThreshold INTEGER DEFAULT 5,
      $columnImageUrl TEXT,
      $columnCreatedAt TEXT NOT NULL,
      $columnUpdatedAt TEXT NOT NULL,
      $columnIsSynced INTEGER DEFAULT 0,
      $columnIsActive INTEGER DEFAULT 1
    )
  ''';

  static List<String> get columns => [
    columnId,
    columnProductId,
    columnName,
    columnSku,
    columnBarcode,
    columnDescription,
    columnPrice,
    columnCostPrice,
    columnQuantity,
    columnCategory,
    columnUnit,
    columnTaxRate,
    columnIsTaxable,
    columnLowStockThreshold,
    columnImageUrl,
    columnCreatedAt,
    columnUpdatedAt,
    columnIsSynced,
    columnIsActive,
  ];
}
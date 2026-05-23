class Product {
  int? id; // Local SQLite ID
  String? productId; // Firebase/Online ID
  String name;
  String sku;
  String barcode;
  String description;
  double price;
  double costPrice;
  int quantity;
  String category;
  String unit;
  double taxRate;
  bool isTaxable;
  int lowStockThreshold;
  String? imageUrl;
  DateTime createdAt;
  DateTime updatedAt;
  bool isSynced;
  bool isActive;

  Product({
    this.id,
    this.productId,
    required this.name,
    required this.sku,
    this.barcode = '',
    this.description = '',
    required this.price,
    required this.costPrice,
    required this.quantity,
    this.category = 'Uncategorized',
    this.unit = 'Piece',
    this.taxRate = 0.0,
    this.isTaxable = true,
    this.lowStockThreshold = 5,
    this.imageUrl,
    required this.createdAt,
    required this.updatedAt,
    this.isSynced = false,
    this.isActive = true,
  });

  // Convert to Map for SQLite
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'productId': productId,
      'name': name,
      'sku': sku,
      'barcode': barcode,
      'description': description,
      'price': price,
      'costPrice': costPrice,
      'quantity': quantity,
      'category': category,
      'unit': unit,
      'taxRate': taxRate,
      'isTaxable': isTaxable ? 1 : 0,
      'lowStockThreshold': lowStockThreshold,
      'imageUrl': imageUrl,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isSynced': isSynced ? 1 : 0,
      'isActive': isActive ? 1 : 0,
    };
  }

  // Create from Map (from SQLite)
  factory Product.fromMap(Map<String, dynamic> map) {
    return Product(
      id: map['id'],
      productId: map['productId'],
      name: map['name'],
      sku: map['sku'],
      barcode: map['barcode'],
      description: map['description'],
      price: map['price'],
      costPrice: map['costPrice'],
      quantity: map['quantity'],
      category: map['category'],
      unit: map['unit'],
      taxRate: map['taxRate'],
      isTaxable: map['isTaxable'] == 1,
      lowStockThreshold: map['lowStockThreshold'],
      imageUrl: map['imageUrl'],
      createdAt: DateTime.parse(map['createdAt']),
      updatedAt: DateTime.parse(map['updatedAt']),
      isSynced: map['isSynced'] == 1,
      isActive: map['isActive'] == 1,
    );
  }

  // Copy with method for updates
  Product copyWith({
    int? id,
    String? productId,
    String? name,
    String? sku,
    String? barcode,
    String? description,
    double? price,
    double? costPrice,
    int? quantity,
    String? category,
    String? unit,
    double? taxRate,
    bool? isTaxable,
    int? lowStockThreshold,
    String? imageUrl,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isSynced,
    bool? isActive,
  }) {
    return Product(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      name: name ?? this.name,
      sku: sku ?? this.sku,
      barcode: barcode ?? this.barcode,
      description: description ?? this.description,
      price: price ?? this.price,
      costPrice: costPrice ?? this.costPrice,
      quantity: quantity ?? this.quantity,
      category: category ?? this.category,
      unit: unit ?? this.unit,
      taxRate: taxRate ?? this.taxRate,
      isTaxable: isTaxable ?? this.isTaxable,
      lowStockThreshold: lowStockThreshold ?? this.lowStockThreshold,
      imageUrl: imageUrl ?? this.imageUrl,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isSynced: isSynced ?? this.isSynced,
      isActive: isActive ?? this.isActive,
    );
  }

  // Calculate profit margin
  double get profitMargin {
    if (costPrice == 0) return 0;
    return ((price - costPrice) / costPrice) * 100;
  }

  // Check if stock is low
  bool get isLowStock => quantity <= lowStockThreshold;

  // Calculate total value
  double get totalValue => price * quantity;
}
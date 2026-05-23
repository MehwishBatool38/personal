import 'package:sqflite/sqflite.dart';
import '../../../models/product_model.dart';
import '../tables/products_table.dart';

class ProductDao {
  final Database database;

  ProductDao(this.database);

  // Insert product
  Future<int> insertProduct(Product product) async {
    try {
      final id = await database.insert(
        ProductsTable.tableName,
        product.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
      return id;
    } catch (e) {
      print('Error inserting product: $e');
      rethrow;
    }
  }

  // Get all products
  Future<List<Product>> getAllProducts({String? category, bool? isActive}) async {
    try {
      String where = '1=1';
      List<dynamic> whereArgs = [];

      if (category != null && category.isNotEmpty) {
        where += ' AND ${ProductsTable.columnCategory} = ?';
        whereArgs.add(category);
      }

      if (isActive != null) {
        where += ' AND ${ProductsTable.columnIsActive} = ?';
        whereArgs.add(isActive ? 1 : 0);
      }

      final maps = await database.query(
        ProductsTable.tableName,
        where: where,
        whereArgs: whereArgs,
        orderBy: '${ProductsTable.columnName} ASC',
      );

      return List.generate(maps.length, (i) => Product.fromMap(maps[i]));
    } catch (e) {
      print('Error getting products: $e');
      rethrow;
    }
  }

  // Get product by ID
  Future<Product?> getProductById(int id) async {
    try {
      final maps = await database.query(
        ProductsTable.tableName,
        where: '${ProductsTable.columnId} = ?',
        whereArgs: [id],
      );

      if (maps.isNotEmpty) {
        return Product.fromMap(maps.first);
      }
      return null;
    } catch (e) {
      print('Error getting product by id: $e');
      rethrow;
    }
  }

  // Get product by SKU
  Future<Product?> getProductBySku(String sku) async {
    try {
      final maps = await database.query(
        ProductsTable.tableName,
        where: '${ProductsTable.columnSku} = ?',
        whereArgs: [sku],
      );

      if (maps.isNotEmpty) {
        return Product.fromMap(maps.first);
      }
      return null;
    } catch (e) {
      print('Error getting product by sku: $e');
      rethrow;
    }
  }

  // Update product
  Future<int> updateProduct(Product product) async {
    try {
      return await database.update(
        ProductsTable.tableName,
        product.toMap(),
        where: '${ProductsTable.columnId} = ?',
        whereArgs: [product.id],
      );
    } catch (e) {
      print('Error updating product: $e');
      rethrow;
    }
  }

  // Delete product
  Future<int> deleteProduct(int id) async {
    try {
      return await database.delete(
        ProductsTable.tableName,
        where: '${ProductsTable.columnId} = ?',
        whereArgs: [id],
      );
    } catch (e) {
      print('Error deleting product: $e');
      rethrow;
    }
  }

  // Soft delete (mark as inactive)
  Future<int> softDeleteProduct(int id) async {
    try {
      return await database.update(
        ProductsTable.tableName,
        {ProductsTable.columnIsActive: 0},
        where: '${ProductsTable.columnId} = ?',
        whereArgs: [id],
      );
    } catch (e) {
      print('Error soft deleting product: $e');
      rethrow;
    }
  }

  // Search products
  Future<List<Product>> searchProducts(String query) async {
    try {
      final maps = await database.query(
        ProductsTable.tableName,
        where: '''
          ${ProductsTable.columnName} LIKE ? OR 
          ${ProductsTable.columnSku} LIKE ? OR 
          ${ProductsTable.columnBarcode} LIKE ? OR 
          ${ProductsTable.columnDescription} LIKE ?
        ''',
        whereArgs: ['%$query%', '%$query%', '%$query%', '%$query%'],
        orderBy: '${ProductsTable.columnName} ASC',
      );

      return List.generate(maps.length, (i) => Product.fromMap(maps[i]));
    } catch (e) {
      print('Error searching products: $e');
      rethrow;
    }
  }

  // Get low stock products
  Future<List<Product>> getLowStockProducts() async {
    try {
      final maps = await database.query(
        ProductsTable.tableName,
        where: '${ProductsTable.columnQuantity} <= ${ProductsTable.columnLowStockThreshold} AND ${ProductsTable.columnIsActive} = 1',
        orderBy: '${ProductsTable.columnQuantity} ASC',
      );

      return List.generate(maps.length, (i) => Product.fromMap(maps[i]));
    } catch (e) {
      print('Error getting low stock products: $e');
      rethrow;
    }
  }

  // Update stock quantity
  Future<int> updateStock(int id, int newQuantity) async {
    try {
      return await database.update(
        ProductsTable.tableName,
        {
          ProductsTable.columnQuantity: newQuantity,
          ProductsTable.columnUpdatedAt: DateTime.now().toIso8601String(),
        },
        where: '${ProductsTable.columnId} = ?',
        whereArgs: [id],
      );
    } catch (e) {
      print('Error updating stock: $e');
      rethrow;
    }
  }

  // Get categories
  Future<List<String>> getCategories() async {
    try {
      final maps = await database.rawQuery('''
        SELECT DISTINCT ${ProductsTable.columnCategory} 
        FROM ${ProductsTable.tableName} 
        WHERE ${ProductsTable.columnCategory} IS NOT NULL 
        AND ${ProductsTable.columnCategory} != '' 
        AND ${ProductsTable.columnIsActive} = 1
        ORDER BY ${ProductsTable.columnCategory} ASC
      ''');

      return List.generate(maps.length, (i) => maps[i][ProductsTable.columnCategory] as String);
    } catch (e) {
      print('Error getting categories: $e');
      return [];
    }
  }

  // Get products by category
  Future<List<Product>> getProductsByCategory(String category) async {
    try {
      final maps = await database.query(
        ProductsTable.tableName,
        where: '${ProductsTable.columnCategory} = ? AND ${ProductsTable.columnIsActive} = 1',
        whereArgs: [category],
        orderBy: '${ProductsTable.columnName} ASC',
      );

      return List.generate(maps.length, (i) => Product.fromMap(maps[i]));
    } catch (e) {
      print('Error getting products by category: $e');
      rethrow;
    }
  }

  // Get total product count
  Future<int> getTotalProductCount() async {
    try {
      final count = Sqflite.firstIntValue(await database.rawQuery(
          'SELECT COUNT(*) FROM ${ProductsTable.tableName} WHERE ${ProductsTable.columnIsActive} = 1'
      ));
      return count ?? 0;
    } catch (e) {
      print('Error getting product count: $e');
      return 0;
    }
  }

  // Get total inventory value
  Future<double> getTotalInventoryValue() async {
    try {
      final result = await database.rawQuery(
          'SELECT SUM(${ProductsTable.columnPrice} * ${ProductsTable.columnQuantity}) as total FROM ${ProductsTable.tableName} WHERE ${ProductsTable.columnIsActive} = 1'
      );

      final total = result.first['total'];
      return total != null ? (total as num).toDouble() : 0.0;
    } catch (e) {
      print('Error getting inventory value: $e');
      return 0.0;
    }
  }
}
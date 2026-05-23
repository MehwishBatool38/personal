import 'dart:io';
import 'package:path/path.dart';
import 'package:smart_pos_app/data/local/database/tables/customers_table.dart';
import 'package:smart_pos_app/data/local/database/tables/ledger_table.dart';
import 'package:smart_pos_app/data/local/database/tables/products_table.dart';
import 'package:smart_pos_app/data/local/database/tables/sales_table.dart';
import 'package:sqflite/sqflite.dart';

// Import table classes - adjust these paths according to your project structure


class SQLiteDatabase {
  static final SQLiteDatabase _instance = SQLiteDatabase._internal();
  static Database? _database;

  factory SQLiteDatabase() {
    return _instance;
  }

  SQLiteDatabase._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final databasePath = await getDatabasesPath();
    final path = join(databasePath, 'smart_pos.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
      onConfigure: _onConfigure,
    );
  }

  Future<void> _onConfigure(Database db) async {
    await db.execute('PRAGMA foreign_keys = ON');
  }

  Future<void> _onCreate(Database db, int version) async {
    // Create all tables
    await db.execute(ProductsTable.createTableQuery);
    await db.execute(SalesTable.createTableQuery);
    await db.execute(CustomersTable.createTableQuery);
    await db.execute(LedgerTable.createTableQuery);

    // Create indexes for better performance
    await db.execute('CREATE INDEX idx_products_sku ON products(sku)');
    await db.execute('CREATE INDEX idx_products_category ON products(category)');
    await db.execute('CREATE INDEX idx_products_isActive ON products(isActive)');
    await db.execute('CREATE INDEX idx_sales_date ON sales(saleDate)');
    await db.execute('CREATE INDEX idx_customers_phone ON customers(phone)');

    print('✅ Database created successfully');
  }

  // Close database
  Future<void> close() async {
    if (_database != null) {
      await _database!.close();
      _database = null;
    }
  }

  // Clear all data (for testing/reset)
  Future<void> clearDatabase() async {
    final db = await database;
    await db.delete(ProductsTable.tableName);
    await db.delete(SalesTable.tableName);
    await db.delete(CustomersTable.tableName);
    await db.delete(LedgerTable.tableName);
  }

  // Backup database to file
  Future<String> backupDatabase() async {
    final db = await database;
    final databasePath = await getDatabasesPath();
    final backupPath = join(databasePath, 'smart_pos_backup_${DateTime.now().millisecondsSinceEpoch}.db');

    // Actually copy the database file
    final originalPath = join(databasePath, 'smart_pos.db');
    final originalFile = File(originalPath);
    final backupFile = File(backupPath);

    if (await originalFile.exists()) {
      await originalFile.copy(backupPath);
      print('✅ Database backed up to: $backupPath');
    }

    return backupPath;
  }

  // Restore database from backup
  Future<void> restoreDatabase(String backupPath) async {
    await close();

    final databasePath = await getDatabasesPath();
    final currentPath = join(databasePath, 'smart_pos.db');

    // Copy backup file to current database location
    final backupFile = File(backupPath);
    final currentFile = File(currentPath);

    if (await backupFile.exists()) {
      await backupFile.copy(currentPath);
      print('✅ Database restored from: $backupPath');
    }

    // Reopen the database
    _database = await openDatabase(
      currentPath,
      version: 1,
      onCreate: _onCreate,
    );
  }

  // Get database size
  Future<int> getDatabaseSize() async {
    final databasePath = await getDatabasesPath();
    final path = join(databasePath, 'smart_pos.db');
    final file = File(path);
    if (await file.exists()) {
      return await file.length();
    }
    return 0;
  }
}
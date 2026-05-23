
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class SidebarMenu extends StatefulWidget {
final User? user;
final Function(int) onItemSelected;
final VoidCallback onSignOut;
final int currentIndex;

SidebarMenu({
required this.user,
required this.onItemSelected,
required this.onSignOut,
required this.currentIndex,
});

@override
_SidebarMenuState createState() => _SidebarMenuState();
}

class _SidebarMenuState extends State<SidebarMenu> {
bool _isProductsExpanded = false;
bool _isReportsExpanded = false;

final List<Map<String, dynamic>> _menuItems = [
{
'title': 'Dashboard',
'icon': Icons.dashboard,
'route': 0,
},
{
'title': 'Products',
'icon': Icons.inventory,
'route': 1,
'children': [
{'title': 'All Products', 'route': 1},
{'title': 'Add Product', 'route': 1},
{'title': 'Categories', 'route': 1},
{'title': 'Stock Alerts', 'route': 1},
],
},
{
'title': 'POS & Sales',
'icon': Icons.point_of_sale,
'route': 2,
'children': [
{'title': 'New Sale', 'route': 2},
{'title': 'Sales History', 'route': 2},
{'title': 'Cart', 'route': 2},
],
},
{
'title': 'Customers',
'icon': Icons.people,
'route': 3,
'children': [
{'title': 'All Customers', 'route': 3},
{'title': 'Add Customer', 'route': 3},
{'title': 'Customer Ledger', 'route': 3},
],
},
{
'title': 'Reports',
'icon': Icons.analytics,
'route': 4,
'children': [
{'title': 'Sales Report', 'route': 4},
{'title': 'Inventory Report', 'route': 4},
{'title': 'Customer Report', 'route': 4},
{'title': 'Financial Report', 'route': 4},
],
},
{
'title': 'Backup & Sync',
'icon': Icons.cloud,
'route': 5,
},
{
'title': 'Settings',
'icon': Icons.settings,
'route': 6,
},
];

@override
Widget build(BuildContext context) {
return Container(
width: 250,
color: Colors.blue[900],
child: Column(
children: [
// User Profile Section
Container(
padding: EdgeInsets.all(20),
decoration: BoxDecoration(
color: Colors.blue[800],
border: Border(
bottom: BorderSide(color: Colors.blue[700]!),
),
),
child: Column(
children: [
// User Avatar
Container(
width: 80,
height: 80,
decoration: BoxDecoration(
shape: BoxShape.circle,
border: Border.all(color: Colors.white, width: 3),
color: Colors.blue[100],
),
child: widget.user?.photoURL != null
? ClipRRect(
borderRadius: BorderRadius.circular(40),
child: Image.network(
widget.user!.photoURL!,
fit: BoxFit.cover,
),
)
    : Icon(
Icons.person,
size: 40,
color: Colors.blue[700],
),
),
SizedBox(height: 15),
Text(
widget.user?.displayName ?? 'POS User',
style: TextStyle(
color: Colors.white,
fontSize: 18,
fontWeight: FontWeight.bold,
),
),
SizedBox(height: 5),
Text(
widget.user?.email ?? 'user@pos.com',
style: TextStyle(
color: Colors.white70,
fontSize: 12,
),
textAlign: TextAlign.center,
),
SizedBox(height: 10),
Container(
padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
decoration: BoxDecoration(
color: Colors.green,
borderRadius: BorderRadius.circular(10),
),
child: Text(
'Premium User',
style: TextStyle(
color: Colors.white,
fontSize: 10,
fontWeight: FontWeight.bold,
),
),
),
],
),
),

// Menu Items
Expanded(
child: SingleChildScrollView(
child: Column(
children: _menuItems.map((item) {
final hasChildren = item.containsKey('children');
final isExpanded = item['title'] == 'Products'
? _isProductsExpanded
    : item['title'] == 'Reports'
? _isReportsExpanded
    : false;

return Column(
children: [
// Parent Menu Item
ListTile(
leading: Icon(
item['icon'],
color: widget.currentIndex == item['route']
? Colors.white
    : Colors.white70,
size: 20,
),
title: Text(
item['title'],
style: TextStyle(
color: widget.currentIndex == item['route']
? Colors.white
    : Colors.white70,
fontWeight: widget.currentIndex == item['route']
? FontWeight.bold
    : FontWeight.normal,
),
),
trailing: hasChildren
? Icon(
isExpanded
? Icons.expand_less
    : Icons.expand_more,
color: Colors.white70,
size: 18,
)
    : null,
onTap: () {
if (hasChildren) {
setState(() {
if (item['title'] == 'Products') {
_isProductsExpanded = !_isProductsExpanded;
} else if (item['title'] == 'Reports') {
_isReportsExpanded = !_isReportsExpanded;
}
});
} else {
widget.onItemSelected(item['route']);
}
},
tileColor: widget.currentIndex == item['route']
? Colors.blue[800]
    : null,
shape: RoundedRectangleBorder(
borderRadius: BorderRadius.circular(10),
),
),

// Child Items
if (hasChildren && isExpanded)
...List.generate(
item['children'].length,
(index) => Padding(
padding: EdgeInsets.only(left: 40),
child: ListTile(
leading: Container(
width: 6,
height: 6,
decoration: BoxDecoration(
shape: BoxShape.circle,
color: Colors.white70,
),
),
title: Text(
item['children'][index]['title'],
style: TextStyle(
color: Colors.white70,
fontSize: 13,
),
),
onTap: () {
widget.onItemSelected(item['children'][index]['route']);
},
minLeadingWidth: 0,
),
),
),
],
);
}).toList(),
),
),
),

// Logout Button
Container(
padding: EdgeInsets.all(20),
decoration: BoxDecoration(
color: Colors.blue[800],
border: Border(
top: BorderSide(color: Colors.blue[700]!),
),
),
child: Row(
children: [
Expanded(
child: ElevatedButton.icon(
onPressed: widget.onSignOut,
icon: Icon(Icons.logout, size: 18),
label: Text('Logout'),
style: ElevatedButton.styleFrom(
backgroundColor: Colors.red,
foregroundColor: Colors.white,
padding: EdgeInsets.symmetric(vertical: 12),
shape: RoundedRectangleBorder(
borderRadius: BorderRadius.circular(10),
),
),
),
),
],
),
),
],
),
);
}
}
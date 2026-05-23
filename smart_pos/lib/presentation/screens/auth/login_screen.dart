import 'package:firebase_auth/firebase_auth.dart' hide AuthProvider;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter/animation.dart';
import '../../providers/auth_provider.dart';
import 'signup_screen.dart';
import '../../widgets/animated_button.dart';
import '../../widgets/pulse_widget.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {

  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _passwordVisible = false;
  late AnimationController _animationController;
  late Animation<double> _slideAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 800),
    );

    _slideAnimation = Tween<double>(begin: 50, end: 0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeOut,
      ),
    );

    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeIn,
      ),
    );

    // Start animation after build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _animationController.forward();
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final size = MediaQuery.of(context).size;

    // Define colors with null safety
    final primaryColor = Colors.blue[700]!;
    final primaryColorDark = Colors.blue[900]!;
    final grey600 = Colors.grey[600]!;
    final grey300 = Colors.grey[300]!;
    final grey500 = Colors.grey[500]!;
    final blue50 = Colors.blue[50]!;
    final blue100 = Colors.blue[100]!;
    final red50 = Colors.red[50]!;
    final red200 = Colors.red[200]!;
    final red700 = Colors.red[700]!;

    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: SingleChildScrollView(
          child: Container(
            height: size.height,
            child: Stack(
              children: [
                // Background Design
                Positioned(
                  top: 0,
                  right: 0,
                  child: Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      color: blue50,
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(100),
                      ),
                    ),
                  ),
                ),

                Positioned(
                  bottom: 0,
                  left: 0,
                  child: Container(
                    width: 150,
                    height: 150,
                    decoration: BoxDecoration(
                      color: blue100,
                      borderRadius: BorderRadius.only(
                        topRight: Radius.circular(100),
                      ),
                    ),
                  ),
                ),

                // Main Content
                Padding(
                  padding: EdgeInsets.all(20),
                  child: AnimatedBuilder(
                    animation: _animationController,
                    builder: (context, child) {
                      return Transform.translate(
                        offset: Offset(0, _slideAnimation.value),
                        child: Opacity(
                          opacity: _fadeAnimation.value,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              SizedBox(height: 60),

                              // Back button
                              IconButton(
                                onPressed: () => Navigator.pop(context),
                                icon: Icon(Icons.arrow_back_ios, size: 20),
                                color: primaryColor,
                              ),

                              SizedBox(height: 20),

                              // Title
                              Text(
                                'Welcome Back',
                                style: TextStyle(
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                  color: primaryColorDark,
                                ),
                              ),

                              SizedBox(height: 5),

                              Text(
                                'Sign in to access your POS system',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: grey600,
                                ),
                              ),

                              SizedBox(height: 40),

                              // Error Message with animation
                              if (authProvider.errorMessage != null)
                                AnimatedContainer(
                                  duration: Duration(milliseconds: 300),
                                  padding: EdgeInsets.all(12),
                                  margin: EdgeInsets.only(bottom: 20),
                                  decoration: BoxDecoration(
                                    color: red50,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: red200),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(Icons.error_outline, color: Colors.red),
                                      SizedBox(width: 10),
                                      Expanded(
                                        child: Text(
                                          authProvider.errorMessage!,
                                          style: TextStyle(color: red700),
                                        ),
                                      ),
                                      IconButton(
                                        icon: Icon(Icons.close, size: 18),
                                        onPressed: () => authProvider.clearError(),
                                      ),
                                    ],
                                  ),
                                ),

                              // Login Form
                              Form(
                                key: _formKey,
                                child: Column(
                                  children: [
                                    // Email Field
                                    TextFormField(
                                      controller: _emailController,
                                      decoration: InputDecoration(
                                        labelText: 'Email Address',
                                        prefixIcon: Icon(Icons.email_outlined),
                                        filled: true,
                                        fillColor: Colors.white,
                                        border: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(15),
                                          borderSide: BorderSide.none,
                                        ),
                                        contentPadding: EdgeInsets.symmetric(
                                          vertical: 15,
                                          horizontal: 20,
                                        ),
                                      ),
                                      keyboardType: TextInputType.emailAddress,
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Please enter your email';
                                        }
                                        if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                                          return 'Please enter a valid email';
                                        }
                                        return null;
                                      },
                                    ),

                                    SizedBox(height: 20),

                                    // Password Field
                                    TextFormField(
                                      controller: _passwordController,
                                      decoration: InputDecoration(
                                        labelText: 'Password',
                                        prefixIcon: Icon(Icons.lock_outline),
                                        suffixIcon: IconButton(
                                          icon: Icon(
                                            _passwordVisible
                                                ? Icons.visibility_outlined
                                                : Icons.visibility_off_outlined,
                                            color: grey600,
                                          ),
                                          onPressed: () {
                                            setState(() {
                                              _passwordVisible = !_passwordVisible;
                                            });
                                          },
                                        ),
                                        filled: true,
                                        fillColor: Colors.white,
                                        border: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(15),
                                          borderSide: BorderSide.none,
                                        ),
                                        contentPadding: EdgeInsets.symmetric(
                                          vertical: 15,
                                          horizontal: 20,
                                        ),
                                      ),
                                      obscureText: !_passwordVisible,
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Please enter your password';
                                        }
                                        if (value.length < 6) {
                                          return 'Password must be at least 6 characters';
                                        }
                                        return null;
                                      },
                                    ),

                                    SizedBox(height: 10),

                                    // Forgot Password
                                    Align(
                                      alignment: Alignment.centerRight,
                                      child: TextButton(
                                        onPressed: () => _showResetPasswordDialog(context),
                                        child: Text(
                                          'Forgot Password?',
                                          style: TextStyle(color: primaryColor),
                                        ),
                                      ),
                                    ),

                                    SizedBox(height: 30),

                                    // Login Button
                                    AnimatedButton(
                                      onPressed: authProvider.isLoading
                                          ? null
                                          : () async {
                                        if (_formKey.currentState!.validate()) {
                                          bool success = await authProvider.signInWithEmail(
                                            _emailController.text.trim(),
                                            _passwordController.text,
                                          );
                                          if (success && context.mounted) {
                                            Navigator.pushReplacementNamed(
                                              context,
                                              '/dashboard',
                                            );
                                          }
                                        }
                                      },
                                      isLoading: authProvider.isLoading,
                                      text: 'Sign In',
                                      icon: Icons.login,
                                    ),

                                    SizedBox(height: 20),

                                    // Divider
                                    Row(
                                      children: [
                                        Expanded(child: Divider(color: grey300)),
                                        Padding(
                                          padding: EdgeInsets.symmetric(horizontal: 15),
                                          child: Text(
                                            'Or continue with',
                                            style: TextStyle(color: grey500),
                                          ),
                                        ),
                                        Expanded(child: Divider(color: grey300)),
                                      ],
                                    ),

                                    SizedBox(height: 20),

                                    // Google Sign In Button
                                    PulseWidget(
                                      child: OutlinedButton(
                                        onPressed: authProvider.isLoading
                                            ? null
                                            : () async {
                                          bool success = await authProvider.signInWithGoogle();
                                          if (success && context.mounted) {
                                            Navigator.pushReplacementNamed(
                                              context,
                                              '/dashboard',
                                            );
                                          }
                                        },
                                        style: OutlinedButton.styleFrom(
                                          padding: EdgeInsets.symmetric(vertical: 15),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(15),
                                          ),
                                          side: BorderSide(color: grey300),
                                          backgroundColor: Colors.white,
                                        ),
                                        child: Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Image.asset(
                                              'assets/images/google_logo.png',
                                              height: 24,
                                              width: 24,
                                            ),
                                            SizedBox(width: 10),
                                            Text(
                                              'Continue with Google',
                                              style: TextStyle(
                                                fontSize: 16,
                                                color: Colors.grey[800],
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),

                                    SizedBox(height: 30),

                                    // Sign Up Link
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          "Don't have an account? ",
                                          style: TextStyle(color: grey600),
                                        ),
                                        GestureDetector(
                                          onTap: () {
                                            Navigator.push(
                                              context,
                                              PageRouteBuilder(
                                                pageBuilder: (_, __, ___) => SignupScreen(),
                                                transitionsBuilder: (_, animation, __, child) {
                                                  return SlideTransition(
                                                    position: Tween<Offset>(
                                                      begin: Offset(1, 0),
                                                      end: Offset.zero,
                                                    ).animate(animation),
                                                    child: child,
                                                  );
                                                },
                                              ),
                                            );
                                          },
                                          child: Text(
                                            'Create Account',
                                            style: TextStyle(
                                              color: primaryColor,
                                              fontWeight: FontWeight.bold,
                                              decoration: TextDecoration.underline,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),

                                    SizedBox(height: 20),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showResetPasswordDialog(BuildContext context) {
    final emailController = TextEditingController();
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.lock_reset,
                size: 50,
                color: Colors.blue,
              ),
              SizedBox(height: 15),
              Text(
                'Reset Password',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 10),
              Text(
                'Enter your email to receive a password reset link',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600]),
              ),
              SizedBox(height: 20),
              TextFormField(
                controller: emailController,
                decoration: InputDecoration(
                  labelText: 'Email Address',
                  prefixIcon: Icon(Icons.email),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              SizedBox(height: 25),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () => Navigator.pop(context),
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: Text('Cancel'),
                    ),
                  ),
                  SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () async {
                        if (emailController.text.isNotEmpty) {
                          try {
                            await authProvider.resetPassword(emailController.text.trim());
                            if (context.mounted) {
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    'Password reset email sent. Check your inbox.',
                                  ),
                                  backgroundColor: Colors.green,
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                              );
                            }
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Error: $e'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          }
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: Text('Send'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
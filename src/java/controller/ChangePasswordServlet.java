package controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import utils.DBUtil;

public class ChangePasswordServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/auth/change_password.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        String currentPassword = request.getParameter("currentPassword");
        String newPassword = request.getParameter("newPassword");
        String confirmPassword = request.getParameter("confirmPassword");

        // Get user ID from session
        String email = (String) session.getAttribute("user");
        if (email == null) {
            request.setAttribute("error", "Please login to change password");
            request.getRequestDispatcher("/auth/login.jsp").forward(request, response);
            return;
        }

        // Validate passwords
        if (!newPassword.equals(confirmPassword)) {
            request.setAttribute("error", "New passwords do not match");
            request.getRequestDispatcher("/auth/change_password.jsp").forward(request, response);
            return;
        }

        if (newPassword.length() < 6) {
            request.setAttribute("error", "New password must be at least 6 characters long");
            request.getRequestDispatcher("/auth/change_password.jsp").forward(request, response);
            return;
        }

        try (Connection conn = DBUtil.getConnection()) {
            // Verify current password
            String checkPasswordQuery = "SELECT password FROM Accounts WHERE email = ?";
            try (PreparedStatement ps = conn.prepareStatement(checkPasswordQuery)) {
                ps.setString(1, email);
                ResultSet rs = ps.executeQuery();

                if (rs.next()) {
                    String storedPassword = rs.getString("password");
                    if (!storedPassword.equals(currentPassword)) {
                        request.setAttribute("error", "Current password is incorrect");
                        request.getRequestDispatcher("/auth/change_password.jsp").forward(request, response);
                        return;
                    }
                }
            }

            // Update password
            String updatePasswordQuery = "UPDATE Accounts SET password = ? WHERE email = ?";
            try (PreparedStatement ps = conn.prepareStatement(updatePasswordQuery)) {
                ps.setString(1, newPassword);
                ps.setString(2, email);
                int rowsAffected = ps.executeUpdate();

                if (rowsAffected > 0) {
                    // Xóa session để đăng xuất người dùng
                    session.invalidate();
                    // Chuyển hướng về trang login với thông báo thành công
                    response.sendRedirect(request.getContextPath() + "/auth/login.jsp?message=Password changed successfully. Please login with your new password.");
                } else {
                    request.setAttribute("error", "Failed to change password");
                    request.getRequestDispatcher("/auth/change_password.jsp").forward(request, response);
                }
            }
        } catch (Exception e) {
            request.setAttribute("error", "An error occurred while changing password");
            request.getRequestDispatcher("/auth/change_password.jsp").forward(request, response);
        }
    }
} 

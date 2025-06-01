<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>Jobseeker Dashboard</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; background: #f5f6fa; }
        .container { max-width: 600px; margin: 100px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 40px; text-align: center; }
        h2 { color: #0984e3; }
        .info { margin-top: 20px; font-size: 18px; }
        .button-group { margin-top: 20px; }
        .button-group a { 
            display: inline-block;
            margin: 0 10px;
            padding: 8px 18px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            cursor: pointer;
        }
        .btn-change-password {
            background: #0984e3;
            color: #fff;
            border: none;
        }
        .btn-logout {
            background: #d63031;
            color: #fff;
            border: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Chào mừng Jobseeker!</h2>
        <div class="info">
            Xin chào, <b><%= session.getAttribute("username") != null ? session.getAttribute("username") : "User" %></b>!<br>
            Đây là dashboard dành cho Jobseeker.
        </div>
        <div class="button-group">
            <a href="${pageContext.request.contextPath}/change-password" class="btn-change-password">Đổi mật khẩu</a>
            <form action="<%=request.getContextPath()%>/logout" method="post" style="display: inline;">
                <button type="submit" class="btn-logout">Đăng xuất</button>
            </form>
        </div>
    </div>
</body>
</html> 
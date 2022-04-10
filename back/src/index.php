<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: *");
  header("Content-Type: application/json");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");

  include("db_connect.php");
  include("token.php");

  $request_method = $_SERVER["REQUEST_METHOD"];
  $route = explode('/', $_SERVER['REQUEST_URI']);

  switch($request_method)
  {
    case 'POST':
      if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = $_POST["username"];
        $password = $_POST["password"];

        $queryCreateUser = "INSERT INTO users (username, password) VALUES('$username', '$password')";
        $queryIsUserExist = "SELECT id, username, password FROM users WHERE username = '$username'";
        
        if ($route[1] === 'signup') {
          $result = mysqli_query($conn, $queryCreateUser);

          if (!$result) {
            http_response_code(409);
            echo json_encode(array('error' => mysqli_error($conn)));
          } else {
            echo json_encode(array('status_message' => 'User registered'));
          }
        }

        if ($route[1] === 'login') {
          $result = mysqli_query($conn, $queryIsUserExist);

          if (mysqli_num_rows($result) > 0) {
            $payload = $username;
            $token = generate_token($payload);
            echo json_encode(array(
              'token' => $token,
              'username' => $username
            ));
          } else {
            http_response_code(409);
            echo json_encode(array('error' => 'pas de user'));
          }
          if (!$result) {
            http_response_code(409);
            die(json_encode(mysqli_error($conn)));
          }
        }

      }
      if ($route[1] === 'post') {
        $token = $_SERVER['HTTP_AUTHORIZATION'];
        if (is_token_valid($token)) {
          $userNameToken = get_username_from_token($token);

          $queryUserId = "SELECT id FROM users WHERE username =''$userNameToken''";

          $resultId = mysqli_query($conn, $queryUserId);

          $dataForId = mysqli_fetch_assoc($resultId);
          $userId = $dataForId['id'];

          $title = $_POST["title"];
          $content = $_POST["content"];

          $queryPost = "INSERT INTO articles (title, content, user_id) VALUES('$title', '$content', '$userId')";

          $result = mysqli_query($conn, $queryPost);

          if (!$result) {
            http_response_code(409);
            echo json_encode(array('error' => mysqli_error($conn)));
          } else {
            echo json_encode(array('post' => 'Article posté !'));
          }
        } else {
          echo json_encode(array('error' => 'Token invalide'));
        }
      }
    break;
    case 'GET':
      if($route[1] === 'articles') {
        $queryAllArticle = "SELECT articles.*, users.username FROM articles INNER JOIN users ON  articles.user_id = users.id";

        $result = mysqli_query($conn, $queryAllArticle);

        if (!$result) {
          http_response_code(409);
          echo json_encode(array('error' => mysqli_error($conn)));
        } else {
          $new_array = array();
          foreach (mysqli_fetch_all($result, MYSQLI_ASSOC) as $to_obj) {
            $new_array[] = (object)$to_obj;
          }
          echo json_encode($new_array);
        }
      }
    break;
  }
?>
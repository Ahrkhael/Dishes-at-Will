-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-06-2024 a las 20:41:24
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendar`
--

CREATE TABLE `calendar` (
  `calendar_id` int(11) NOT NULL,
  `user_id_fk` int(11) NOT NULL,
  `monday_breakfast_recipe_fk` int(11) NOT NULL,
  `monday_lunch_recipe_fk` int(11) NOT NULL,
  `monday_dinner_recipe_fk` int(11) NOT NULL,
  `tuesday_breakfast_recipe_fk` int(11) NOT NULL,
  `tuesday_lunch_recipe_fk` int(11) NOT NULL,
  `tuesday_dinner_recipe_fk` int(11) NOT NULL,
  `wednesday_breakfast_recipe_fk` int(11) NOT NULL,
  `wednesday_lunch_recipe_fk` int(11) NOT NULL,
  `wednesday_dinner_recipe_fk` int(11) NOT NULL,
  `thursday_breakfast_recipe_fk` int(11) NOT NULL,
  `thursday_lunch_recipe_fk` int(11) NOT NULL,
  `thursday_dinner_recipe_fk` int(11) NOT NULL,
  `friday_breakfast_recipe_fk` int(11) NOT NULL,
  `friday_lunch_recipe_fk` int(11) NOT NULL,
  `friday_dinner_recipe_fk` int(11) NOT NULL,
  `saturday_breakfast_recipe_fk` int(11) NOT NULL,
  `saturday_lunch_recipe_fk` int(11) NOT NULL,
  `saturday_dinner_recipe_fk` int(11) NOT NULL,
  `sunday_breakfast_recipe_fk` int(11) NOT NULL,
  `sunday_lunch_recipe_fk` int(11) NOT NULL,
  `sunday_dinner_recipe_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `calendar`
--

INSERT INTO `calendar` (`calendar_id`, `user_id_fk`, `monday_breakfast_recipe_fk`, `monday_lunch_recipe_fk`, `monday_dinner_recipe_fk`, `tuesday_breakfast_recipe_fk`, `tuesday_lunch_recipe_fk`, `tuesday_dinner_recipe_fk`, `wednesday_breakfast_recipe_fk`, `wednesday_lunch_recipe_fk`, `wednesday_dinner_recipe_fk`, `thursday_breakfast_recipe_fk`, `thursday_lunch_recipe_fk`, `thursday_dinner_recipe_fk`, `friday_breakfast_recipe_fk`, `friday_lunch_recipe_fk`, `friday_dinner_recipe_fk`, `saturday_breakfast_recipe_fk`, `saturday_lunch_recipe_fk`, `saturday_dinner_recipe_fk`, `sunday_breakfast_recipe_fk`, `sunday_lunch_recipe_fk`, `sunday_dinner_recipe_fk`) VALUES
(2, 16, 23, 63, 23, 14, 13, 23, 63, 19, 23, 13, 63, 14, 13, 14, 13, 14, 63, 13, 19, 14, 23);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredients`
--

CREATE TABLE `ingredients` (
  `ingredient_id` int(11) NOT NULL,
  `ingredient` varchar(50) NOT NULL,
  `kcal` float NOT NULL,
  `proteins` float NOT NULL,
  `fat` float NOT NULL,
  `carbohydrates` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ingredients`
--

INSERT INTO `ingredients` (`ingredient_id`, `ingredient`, `kcal`, `proteins`, `fat`, `carbohydrates`) VALUES
(1, 'Aceite de oliva', 900, 0, 100, 0),
(2, 'Azúcar', 3.74, 0, 0, 99.98),
(3, 'Tomate', 22, 1.2, 4, 5.1),
(5, 'Manzana', 54.08, 0.31, 0.36, 11.4),
(6, 'Huevos', 162, 12.68, 12.1, 0.68),
(7, 'Pan blanco', 261, 8.47, 1.6, 51.5),
(8, 'Arroz', 364, 6.67, 0.9, 81.6),
(9, 'Patata', 73.59, 2.34, 0.11, 14.8),
(10, 'Ajo', 119, 4.3, 0.23, 24.3),
(11, 'Pasta', 359, 12.78, 1.58, 70.9),
(12, 'Pimiento rojo', 32.9, 1.25, 0.9, 4.2),
(13, 'Mayonesa', 709, 1.3, 75.6, 5.8),
(14, 'Lomo de cerdo', 311, 16.25, 26.6, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recipes`
--

CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL,
  `user_id_fk` int(11) NOT NULL,
  `name_recipe` varchar(50) NOT NULL,
  `total_kcal` double NOT NULL,
  `total_proteins` double NOT NULL,
  `total_fat` double NOT NULL,
  `total_carbohydrates` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `user_id_fk`, `name_recipe`, `total_kcal`, `total_proteins`, `total_fat`, `total_carbohydrates`) VALUES
(13, 16, 'Tortilla   ', 127.1968, 0, 14, 31.9936),
(14, 16, 'Huevos ', 171.87, 2.4, 22, 60.19),
(19, 16, 'Papas ', 479.30490000000003, 0, 53.2, 13.497300000000001),
(20, 41, 'Campero', 0, 0, 0, 0),
(23, 16, 'Tortilla de papas  ', 939.45, 21.21, 59.625, 74.51),
(28, 45, 'Potaje', 0, 0, 0, 0),
(63, 16, 'Arroz con huevo ', 739.5, 16.345, 19.9, 122.74000000000001);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recipe_ingredients`
--

CREATE TABLE `recipe_ingredients` (
  `recipe_id_fk` int(11) NOT NULL,
  `ingredient_id_fk` int(11) NOT NULL,
  `quantity` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recipe_ingredients`
--

INSERT INTO `recipe_ingredients` (`recipe_id_fk`, `ingredient_id_fk`, `quantity`) VALUES
(13, 1, '14'),
(14, 1, '14'),
(19, 1, '53.2'),
(20, 1, '14g'),
(23, 1, '50'),
(28, 1, '14g'),
(63, 1, '12.5'),
(13, 2, '32'),
(14, 2, '50'),
(19, 2, '13.5'),
(14, 3, '200'),
(28, 3, '1'),
(23, 6, '75'),
(63, 6, '50'),
(63, 8, '150'),
(23, 9, '500');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password_user` varchar(255) NOT NULL,
  `rol_user` varchar(20) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_user`, `rol_user`) VALUES
(1, 'Juan Jose', 'juanjo@admin.com', '$2y$10$ANdCOO7gow7szgYgRkRumOhJrOCuAAItd98AdWsNO1h/52.OOU3j6', 'superadmin'),
(6, 'Antonio', 'antonio@user.com', '$2y$10$jAOGMr31Nsl/8gRbzFxQReURYLSlGNOvVs4QdVxgjAW7VyBKsQiry', 'user'),
(12, 'Alvaro', 'alvaro@user.com', '$2y$10$KKbpoLyg3ctXcsMlBGi8JuN.lQoOyUjQ/duxWA3yCkFx3fXgJeqyu', 'user'),
(16, 'Lucia', 'lucia@user.com', '$2y$10$BYOazgeZeOUTrCG7FBh8sOyDbPKEy0XQkMBLo5xoV94ebXx.UXoAu', 'user'),
(21, 'Pepe', 'pepe@user.com', '$2y$10$mRtNZoI32XLW0fT.Eu84fuzQwbLHYW2w/BlRe9.cl.dxKDzwCdcBW', 'banned'),
(41, 'Eto', 'eto@user.com', '$2y$10$jAOGMr31Nsl/8gRbzFxQReURYLSlGNOvVs4QdVxgjAW7VyBKsQiry', 'user'),
(45, 'Maria', 'maria@user.com', '$2y$10$Yozlcy9L7l6hnw38rxTgpu7mw86byMdRX37HGhFPV5ghrF7FFEJCC', 'user'),
(48, 'Judith', 'judith@user.com', '$2y$10$KUu9f5vIHmPIvosM3Z0Uw.3a6oOYGP9HEgpreJMoYQlLbfNcT8CmG', 'user');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `calendar`
--
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`calendar_id`),
  ADD KEY `user_id_fk_calendar` (`user_id_fk`),
  ADD KEY `monday_lunch_recipe_fk` (`monday_lunch_recipe_fk`),
  ADD KEY `monday_dinner_recipe_fk` (`monday_dinner_recipe_fk`),
  ADD KEY `tuesday_lunch_recipe_fk` (`tuesday_lunch_recipe_fk`),
  ADD KEY `tuesday_dinner_recipe_fk` (`tuesday_dinner_recipe_fk`),
  ADD KEY `wednesday_lunch_recipe_fk` (`wednesday_lunch_recipe_fk`),
  ADD KEY `wednesday_dinner_recipe_fk` (`wednesday_dinner_recipe_fk`),
  ADD KEY `thursday_lunch_recipe_fk` (`thursday_lunch_recipe_fk`),
  ADD KEY `friday_lunch_recipe_fk` (`friday_lunch_recipe_fk`),
  ADD KEY `saturday_lunch_recipe_fk` (`saturday_lunch_recipe_fk`),
  ADD KEY `sunday_lunch_recipe_fk` (`sunday_lunch_recipe_fk`),
  ADD KEY `thursday_dinner_recipe_fk` (`thursday_dinner_recipe_fk`),
  ADD KEY `friday_dinner_recipe_fk` (`friday_dinner_recipe_fk`),
  ADD KEY `saturday_dinner_recipe_fk` (`saturday_dinner_recipe_fk`),
  ADD KEY `sunday_dinner_recipe_fk` (`sunday_dinner_recipe_fk`),
  ADD KEY `monday_breakfast_recipe_fk` (`monday_breakfast_recipe_fk`),
  ADD KEY `tuesday_breakfast_recipe_fk` (`tuesday_breakfast_recipe_fk`),
  ADD KEY `wednesday_breakfast_recipe_fk` (`wednesday_breakfast_recipe_fk`),
  ADD KEY `thursday_breakfast_recipe_fk` (`thursday_breakfast_recipe_fk`),
  ADD KEY `friday_breakfast_recipe_fk` (`friday_breakfast_recipe_fk`),
  ADD KEY `saturday_breakfast_recipe_fk` (`saturday_breakfast_recipe_fk`),
  ADD KEY `sunday_breakfast_recipe_fk` (`sunday_breakfast_recipe_fk`);

--
-- Indices de la tabla `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`ingredient_id`);

--
-- Indices de la tabla `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`),
  ADD KEY `user_id_fk` (`user_id_fk`);

--
-- Indices de la tabla `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD PRIMARY KEY (`ingredient_id_fk`,`recipe_id_fk`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calendar`
--
ALTER TABLE `calendar`
  MODIFY `calendar_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `ingredient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calendar`
--
ALTER TABLE `calendar`
  ADD CONSTRAINT `friday_breakfast_recipe_fk` FOREIGN KEY (`friday_breakfast_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `friday_dinner_recipe_fk` FOREIGN KEY (`friday_dinner_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `friday_lunch_recipe_fk` FOREIGN KEY (`friday_lunch_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `monday_breakfast_recipe_fk` FOREIGN KEY (`monday_breakfast_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `monday_dinner_recipe_fk` FOREIGN KEY (`monday_dinner_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `monday_lunch_recipe_fk` FOREIGN KEY (`monday_lunch_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `saturday_breakfast_recipe_fk` FOREIGN KEY (`saturday_breakfast_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `saturday_dinner_recipe_fk` FOREIGN KEY (`saturday_dinner_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `saturday_lunch_recipe_fk` FOREIGN KEY (`saturday_lunch_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sunday_breakfast_recipe_fk` FOREIGN KEY (`sunday_breakfast_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sunday_dinner_recipe_fk` FOREIGN KEY (`sunday_dinner_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sunday_lunch_recipe_fk` FOREIGN KEY (`sunday_lunch_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `thursday_breakfast_recipe_fk` FOREIGN KEY (`thursday_breakfast_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `thursday_dinner_recipe_fk` FOREIGN KEY (`thursday_dinner_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `thursday_lunch_recipe_fk` FOREIGN KEY (`thursday_lunch_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tuesday_breakfast_recipe_fk` FOREIGN KEY (`tuesday_breakfast_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tuesday_dinner_recipe_fk` FOREIGN KEY (`tuesday_dinner_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tuesday_lunch_recipe_fk` FOREIGN KEY (`tuesday_lunch_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_id_fk_calendar` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wednesday_breakfast_recipe_fk` FOREIGN KEY (`wednesday_breakfast_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wednesday_dinner_recipe_fk` FOREIGN KEY (`wednesday_dinner_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wednesday_lunch_recipe_fk` FOREIGN KEY (`wednesday_lunch_recipe_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `user_id_fk` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD CONSTRAINT `ingredient_id_fk` FOREIGN KEY (`ingredient_id_fk`) REFERENCES `ingredients` (`ingredient_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recipe_id_fk` FOREIGN KEY (`recipe_id_fk`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

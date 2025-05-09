# 🏥 Sistema de Gestión Hospitalaria en Microservicios

📚 *Proyecto final de la materia de Aplicaciones Distribuidas – Universidad Técnica de Ambato (UTA)*  
🎓 Facultad de Ingeniería en Sistemas, Electrónica e Industrial

## 📌 Descripción

Este sistema distribuido gestiona múltiples centros médicos (Quito, Guayaquil, Cuenca), empleando una arquitectura basada en **microservicios**, bases de datos replicadas (**Master-Slave** con MariaDB) y comunicación a través de **REST APIs**.  

Todo está orquestado con **Docker Compose** y controlado con **Git + GitHub**.

## 🛠️ Tecnologías Utilizadas
# Backend:
Node.js, Express, JWT, Sequelize

# Frontend:
React + Vite

# Base de Datos:
MariaDB con replicación

# Contenerización:
Docker & Docker Compose

# DevOps: GitHub

- Despliegue (sugerido): Vercel (Frontend), Azure App Service o Render (Backend)

## ✅ Requisitos
 - Git

 - Node.js 18+

 - npm

 - Docker + Docker Compose

 ## 🚀 Instalación Rápida
 - git clone https://github.com/Jeffer2S/hospital_system.git
 - cd sistema-hospitalario

## 🐳 Levantar el Entorno con Docker
- docker-compose up -d

## 🧪 Instalación de Dependencias

- cd api && npm install
- cd front && npm install

## ▶️ Ejecución
- back: npm run dev
- front: npm run dev

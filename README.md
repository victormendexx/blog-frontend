# Mural — Front-end (Tech Challenge Fase 3)

![CI/CD](https://github.com/victormendexx/blog-frontend/actions/workflows/ci-cd.yml/badge.svg)

Interface React para a plataforma de blogging educacional **Mural**, consumindo a API REST
desenvolvida na Fase 2 ([blog-api](https://github.com/victormendexx/blog-api)). Permite que
alunos leiam e busquem posts publicamente, e que professores autenticados criem, editem e
excluam conteúdo.

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como rodar localmente](#como-rodar-localmente)
- [Como rodar com Docker](#como-rodar-com-docker)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Guia de uso](#guia-de-uso)
- [CI/CD](#cicd)
- [Desafios e aprendizados](#desafios-e-aprendizados)

## Sobre o projeto

Este repositório contém **apenas o front-end**. Ele depende da API REST do repositório
[`blog-api`](https://github.com/victormendexx/blog-api) estar em execução — local ou publicada
— para funcionar por completo.

## Arquitetura
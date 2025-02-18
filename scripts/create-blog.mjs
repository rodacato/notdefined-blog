#!/usr/bin/env node
import { program } from 'commander'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import inquirer from 'inquirer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const POSTS_DIR = path.join(__dirname, '../_posts')
const ASSETS_DIR = path.join(__dirname, '../public/assets/blog')

const generateMarkdown = (slug, title, author) => `---
title: "${title}"
excerpt: "Short description of the post..."
coverImage: "/assets/blog/${slug}/cover.jpg"
date: "${new Date().toISOString()}"
author:
  name: "${author}"
  picture: "/assets/blog/authors/default.jpeg"
ogImage:
  url: "/assets/blog/${slug}/cover.jpg"
---

## Introduction

Write your content here...
`

program
  .argument('<slug>', 'Slug for the blog post')
  .option('-t, --title <title>', 'Title of the blog post')
  .option('-a, --author <author>', "Author's name", 'Default Author')
  .action(async (slug, options) => {
    const postDir = path.join(POSTS_DIR, slug)
    const assetDir = path.join(ASSETS_DIR, slug)
    const mdPath = path.join(postDir, 'index.md')

    // Ask for missing options
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Blog post title:',
        when: !options.title
      },
      {
        type: 'input',
        name: 'author',
        message: "Author's name:",
        when: !options.author
      }
    ])

    const title = options.title || answers.title
    const author = options.author || answers.author

    // Ensure directories exist
    await fs.ensureDir(postDir)
    await fs.ensureDir(assetDir)

    // Create Markdown file
    await fs.writeFile(mdPath, generateMarkdown(slug, title, author))

    // Create placeholder cover image
    await fs.writeFile(path.join(assetDir, 'cover.jpg'), '')

    console.log(`✅ Blog post created at: ${mdPath}`)
    console.log(`📁 Assets directory: ${assetDir}`)
  })

program.parse()

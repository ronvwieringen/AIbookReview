"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FilterSidebarProps {
  filters: {
    genres: string[]
    languages: string[]
    qualityScoreRange: [number, number]
    readerRatingRange: [number, number]
    keywords: string[]
  }
  onFiltersChange: (filters: FilterSidebarProps["filters"]) => void
}

const availableGenres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Thriller",
  "Biography",
  "Self-Help",
  "History",
  "Poetry",
  "Young Adult",
  "Children's",
  "Horror",
  "Literary Fiction",
]

const availableLanguages = ["English", "Dutch", "German", "French", "Spanish", "Italian", "Portuguese"]

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const [keywordInput, setKeywordInput] = useState("")

  const handleGenreChange = (genre: string, checked: boolean) => {
    const newGenres = checked ? [...filters.genres, genre] : filters.genres.filter((g) => g !== genre)

    onFiltersChange({ ...filters, genres: newGenres })
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    const newLanguages = checked ? [...filters.languages, language] : filters.languages.filter((l) => l !== language)

    onFiltersChange({ ...filters, languages: newLanguages })
  }

  const handleQualityScoreChange = (value: number[]) => {
    onFiltersChange({ ...filters, qualityScoreRange: [value[0], value[1]] })
  }

  const handleReaderRatingChange = (value: number[]) => {
    onFiltersChange({ ...filters, readerRatingRange: [value[0], value[1]] })
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !filters.keywords.includes(keywordInput.trim())) {
      onFiltersChange({
        ...filters,
        keywords: [...filters.keywords, keywordInput.trim()],
      })
      setKeywordInput("")
    }
  }

  const removeKeyword = (keyword: string) => {
    onFiltersChange({
      ...filters,
      keywords: filters.keywords.filter((k) => k !== keyword),
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      genres: [],
      languages: [],
      qualityScoreRange: [0, 100],
      readerRatingRange: [0, 5],
      keywords: [],
    })
  }

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.languages.length > 0 ||
    filters.qualityScoreRange[0] > 0 ||
    filters.qualityScoreRange[1] < 100 ||
    filters.readerRatingRange[0] > 0 ||
    filters.readerRatingRange[1] < 5 ||
    filters.keywords.length > 0

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-[#2A4759]">Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-[#F79B72] hover:text-[#e68a61]">
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Quality Score */}
        <div>
          <Label className="text-sm font-medium text-[#2A4759] mb-3 block">
            AI Quality Score: {filters.qualityScoreRange[0]} - {filters.qualityScoreRange[1]}
          </Label>
          <Slider
            value={filters.qualityScoreRange}
            onValueChange={handleQualityScoreChange}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Reader Rating */}
        <div>
          <Label className="text-sm font-medium text-[#2A4759] mb-3 block">
            Reader Rating: {filters.readerRatingRange[0]} - {filters.readerRatingRange[1]} stars
          </Label>
          <Slider
            value={filters.readerRatingRange}
            onValueChange={handleReaderRatingChange}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Genres */}
        <div>
          <Label className="text-sm font-medium text-[#2A4759] mb-3 block">Genres</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableGenres.map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${genre}`}
                  checked={filters.genres.includes(genre)}
                  onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                />
                <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                  {genre}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Languages */}
        <div>
          <Label className="text-sm font-medium text-[#2A4759] mb-3 block">Languages</Label>
          <div className="space-y-2">
            {availableLanguages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`language-${language}`}
                  checked={filters.languages.includes(language)}
                  onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                />
                <Label htmlFor={`language-${language}`} className="text-sm cursor-pointer">
                  {language}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Keywords */}
        <div>
          <Label className="text-sm font-medium text-[#2A4759] mb-3 block">Keywords</Label>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add keyword..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addKeyword()}
              className="flex-1"
            />
            <Button size="sm" onClick={addKeyword} className="bg-[#F79B72] hover:bg-[#e68a61]">
              Add
            </Button>
          </div>
          {filters.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeKeyword(keyword)} />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
